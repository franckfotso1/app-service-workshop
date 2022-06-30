---
sectionid: lab2-monitoring
sectionclass: h2
title: Observabilité
parent-id: lab-2
---

### Observer les chaînes d'appels

Il est possible d'utiliser la solution Open-source [Zipkin](https://zipkin.io/) pour tracer les appels entre les services. Il suffit pour ça de configurer Dapr de la manière suivante

```yml
# Fichier : src/Lab2/4-observability/config/config-tracing.yml
apiVersion: dapr.io/v1alpha1
kind: Configuration
metadata:
  name: daprConfig
  namespace: default
spec:
  tracing:
    samplingRate: "1"
    zipkin:
      # zipkin:9411 est accessible grâce à docker-compose. Il faudrait un service dedié
      # dans un environnement Kubernetes
      endpointAddress: "http://zipkin:9411/api/v2/spans"
```

> **Question**: Comparez le déploiement de l'exercice précédent (`src/Lab2/3-bindings/docker-compose.yml`) et de l'exercice en cours (`src/Lab2/4-observability/docker-compose.yml`). Comment configurer Dapr pour prendre en compte Zipkin ?

Solution:
{% collapsible %}

En prenant comme exemple le déploiement du service **command-api**.

```diff
  ############################
  # Command API
  ############################
  command-api:
    image: dockerutils/command-api
    #build: ../implementations/command-api
    networks:
      - hello-dapr
    environment:
     - PUB_URL=http://localhost:3500/v1.0/publish/order-pub-sub/orders
    depends_on:
      - redis
  command-api-dapr:
    image: "daprio/daprd:edge"
    command: ["./daprd",
     "-app-id", "command-api",
     "-app-port", "80",
     "-dapr-grpc-port", "50002",
+    "-config", "/config/tracing-config.yml",
     "-components-path", "/components"]
    volumes:
        - "./components/:/components"
+       - "./config/:/config"
    depends_on:
      - command-api
+      - zipkin
    network_mode: "service:command-api"
```

En plus du déploiement de Zipkin en lui-même, la configuration de Dapr est appliquée à l'aide de l'argument **-config**. Le fichier de configuration en lui-même est monté dans un volume différent de celui des composants.

Dans un contexte Kubernetes, la configuration serait appliquée à l'aide d'un `kubectl apply -f config-tracing.yml`
{% endcollapsible %}

Déployez `src/Lab2/4-observability/docker-compose.yml` et passez quelques commandes via l'interface. Naviguez à l'adresse `localhost:9415` pour vous rendre sur l'interface de Zipkin. Dans l'onglet "dépendances", prenez une plage large (ex: [j-1, j+1]) et observez le diagramme.

> **Question** : Quels sont les services affichés ? Comment ces services communiquent-ils ?

Solution:
{% collapsible %}
Les services affichés sont :

- **command-api**
- **order-processing**
- **receipt-generator**
- **stock-manager**

Communications :

- **command-api** --> **order-processing** : pub/sub
- **order-processing** --> **receipt-generator** : invocation de service
- **order-processing** --> **stock-manager** : invocation de service

{% endcollapsible %}

> **Question** : Quels sont le(s) service(s) manquant(s) ? Pourquoi ?

**Indication** : Il peut y avoir un certain temps d'attente avant que le diagramme s'affiche. Vous pouvez utiliser l'image ci-dessous si le temps manque.

{% collapsible %}
![zipkin deps](/media/lab2/observability/zipkin-deps.png)
{% endcollapsible %}

Solution:
{% collapsible %}
Le service manquant est **command-frontend**. C'est en effet le seul service qui ne possède pas de sidecar, étant donné qu'il se trouve côté client.

On remarquera aussi que les bindings ne sont pas représentés. En effet ceux-ci font le lien entre notre application et des systèmes externes, qui ne sont donc pas retracés dans un compte rendu sur les chaînes d'appels internes.
{% endcollapsible %}

### Observer les métriques

Un autre axe de l'observabilité est celui des métriques des conteneurs. Ces métriques sont des statistiques généralistes qui permettent d'avoir une vue opérationelle sur le cluster.

Ces statistiques contiennent notamment :

- Utilisation CPU des sidecars
- Utilisation RAM des sidecars
- Latence moyenne entre chaque service et son sidecar
- Uptime des sidecars
- Etats des composants
- Statistiques des appels HTTP/gRPC

La liste complète des métriques envoyées par chaque composant de Dapr est disponible [ici](https://github.com/dapr/dapr/blob/master/docs/development/dapr-metrics.md)

Toutes ces métriques sont émises dans des formats ouverts et peuvent être récupérées et analysées par des outils dédiées tels que [Azure Monitor](https://azure.microsoft.com/fr-fr/services/monitor/#overview), ou [Prometheus](https://prometheus.io).

[Chaque release](https://github.com/dapr/dapr/releases) de Dapr propose également des dashboards [Grafana](https://grafana.com/) permettant d'avoir un récapitulatif graphique des métriques collectées.

![grafana dapr doc](/media/lab2/metrics/grafana-doc-example.png)

Un guide est disponible [sur la documentation](https://docs.dapr.io/operations/monitoring/metrics/grafana/) expliquant la mise en place de ces dashboards.

#### En application (Facultatif)

> **Important** : Cette section va montrer comment obtenir certaines métriques sur notre exemple fil rouge. Il faut cependant noter que les dashboards grafana fournis par l'équipe Dapr sont conçus pour Kubernetes, certaines métriques ne seront pas disponibles.

Pour obtenir les métriques de notre application, nous allons donc avoir besoin de rajouter deux services à notre déploiement : Prometheus et Grafana.

Prometheus est un outil d'analyse de séries temporelles (variables variant au cours du temps). Il permet de récupérer de plusieurs sources HTTP des informations et de les aggréger, proposant même un système d'alertes.

Grafana est un outil de visualisation souvent utilisé en conjonction de Prometheus. Il est capable de créer des _dashboards_ à partir de pluseiurs sources de données, donnant alors une visualisation fine des données à l'utilisateur.

> **En pratique**: Déployez l'application spécifiée par `src/Lab2/5-metrics/docker-compose.yml`. Naviguez maintenant vers Grafana à l'adresse **localhost:9417**, puis choississez le _dashboard_ "dapr-sidecar-dashboard" dans _Dashboards -> Browse_. Qu'observez-vous ?

**Indication** : Il vous faudra sûrement réduire la fenêtre d'observation à 5 minutes pour voir une évolution dans les graphiques, ainsi que de lancer quelques commandes

Solution:
{% collapsible %}
![sample grafana result](/media/lab2/metrics/sample-grafana-result.png)

On observe que les métriques présente sont celles des latences et des composants.

L'utilisation CPU/RAM n'est elle pas renseignée pour cet exemple. En effet, ces données sont extrapolées à partir des données des [métriques Kubernetes](https://github.com/kubernetes/kubernetes/blob/master/test/instrumentation/testdata/stable-metrics-list.yaml), qui ne sont pas présentes ici pour des raisons évidentes.

{% endcollapsible %}

##### Par curiosité : Quelques détails sur Prometheus et docker-compose

Le déploiement de cette section n'est pas expliqué, seulement exécuté. La raison est que faire fonctionner Prometheus avec Dapr sur docker-compose demande d'utiliser une configuration qui n'a pas vraiment d'intérêt dans un scénario de production.

En effet, les métriques de Dapr sont émises par chaque sidecar sur leur port 9090 (par défaut).
Dans une utilisation sur Kubernetes ou sans orchestrateur, chaque sidecar émettrait sur le même endpoint sur le port 9090. Il n'y aurait plus qu'alors qu'à renseigner ce endpoint dans Prometheus.

Cependant, la gestion des [docker networks](https://docs.docker.com/network/) dans docker-compose ne permet pas à chaque sidecar d'émettre sur le même endpoint. Afin de restaurer le fonctionnement, il faut alors lister chacun des services dans la configuration de Prometheus.

```yml
global:
  scrape_interval: 15s
scrape_configs:
  - job_name: "dapr"
    scrape_interval: 5s

    static_configs:
      - targets:
          [
            "command-api:9090",
            "order-processing:9090",
            "stock-manager:9090",
            "receipt-generator:9090",
          ]
```

De plus, si ce sont bien les sidecars qui émettent les métriques, ces sidecars partagent une interface avec leur service. Il faut donc donc exposer le port 9090 du service qui permettra d'accéder à ce port sur le sidecar.

```diff
  order-processing:
    image: dockerutils/order-processing
+    expose:
+      - 9090
      ...
    networks:
      - hello-dapr
  order-processing-dapr:
    image: "daprio/daprd:edge"
      ...
    network_mode: "service:order-processing"
```

Une fois Prometheus configuré il suffit de configurer Grafana pour utiliser Prometheus de cette manière 

```ini
[auth]
# Remove the login prompt 
disable_login_form = true

[auth.anonymous]
# enable anonymous access 
enabled = true
# And give "anonymous" admin privileges
org_role = Admin
```
