---
sectionid: lab2-monitoring
sectionclass: h2
title: Observabilité
parent-id: lab-2
---

Il est possible d'utiliser la solution Open-source Zipkin pour tracer les appels entre les services. Il suffit opour ça de configurer Dapr de la manière suivante 

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
    image: daprbuildworkshopacr.azurecr.io/command-api
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


Déployez `src/Lab2/4-observability/docker-compose.yml` et passez quelques commandes via l'interface. Naviguez à l'adresse `localhost:9415` pour vous rendre sur l'interface de Zipkin. Dans l'onglet "dépendances", prenez une plage large (ex:  [j-1, j+1]) et observez le diagramme.

> **Question** : Quels sont les services affichés ? Comment ces services communiquent-ils ? 

> **Question** : Quels sont les services manquants ? Pourquoi ?

**Indication** : Il peut y avoir un certain temps d'attente avant que le diagramme s'affiche. Vous pouvez utiliser l'image ci-dessous si le temps manque.

{% collapsible %}
![zipkin deps](/media/lab2/observability/zipkin-deps.png)
{% endcollapsible %}
