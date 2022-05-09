---
sectionid: lab2-monitoring
sectionclass: h2
title: Invocation de Service
parent-id: lab-2
---

### Généralités 

> **Question généraliste**: Qu'est-ce que le *Service Meshing* ? Quels sont les exemples de logiciels proposant cette fonctionnalité ? 

> **Question généraliste**: Qu'est-ce que le *gRPC* ? Quels sont ses avantages et inconvénients ?   

### Dapr 

A l'aide de la [documentation](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/service-invocation-overview/), nous allons nous intéresser à ces questions

> **Question** : Quel est le principe de l'invocation de service ? Quel est le trajet d'un paquet envoyé par le service A invoquant le service B ?

> **Question** : Quel sont les protocoles utilisés lors des différentes étapes d'un trajet de paquet d'un service A a un service B ? 

> **Question** : Dans [l'exemple de la page de la documentation](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/service-invocation-overview#example), l'URL permettant à **pythonapp** d'appeler **nodeapp** est  *http://localhost:3500/v1.0/invoke/nodeapp/method/neworder*. Décomposez cette URL et expliquez ses composantes.

Solution:

{%collapsible %}
En prenant chacune de ses composantes : 
- **http://localhost:3500** : Appel vers le sidecar (non chiffré, inutile car même sandbox applicative)
- **v1.0** : Version de l'API Dapr
- **invoke** : Utilisation de l'API d'invocation de service
- **nodeapp** : Nom du service à appeller
- **method** : Appel d'une méthode sur le service
- **neworder** : Nom de la méthode à appeler sur le service
{% endcollapsible %}

> **Question**: Quelle est la différence entre un *Service Meshing* et l'invocation de service de Dapr ?

Solution:

{%collapsible %}
<u>Sur la cible</u>: 
Le Service Meshing se déploie sur une infrastructure, et est unique à cette infrastructure. C'est une fonctionnalité OPS.
L'invocation de service de Dapr est indépendante de l'infrastructure, elle concerne le DEV.

<u>Sur les foctionnalités</u>: 
Si un Service Meshing et l'invocation de Service de Dapr permettent tous les deux de faciliter les appels de service à service, le service meshing va travailler au niveau du réseau, tandis que Dapr va travailler au niveau de l'application. Il en suit :

- Dapr **ajoute** une découverte des méthodes de l'application en plus de résoudre le nom du service
- Dapr **ne permettra pas** de redirections réseau à travers Internet (ou un tunnel) dans un cas d'application cross-cloud par exemple.

Il est donc possible d'utiliser un service comme *Istio* en conjonction avec Dapr, les services n'ayant pas la même couverture fonctionnelle

Voir https://docs.dapr.io/concepts/service-mesh/
{% endcollapsible %}

> **Ouverture** : Dans la page, il est fait mention de *Dapr Sentry*. Quel est son rôle ? Observez le fichier `docker-compose.yml` de l'exercice précédent, Sentry est-il présent ? Qu'en déduisez vous ?

Solution:

{%collapsible %}
Sentry permet le **chiffrage** et **l'authentification mutuelle** des communications entre services. Il permet la communication mTLS entre les services, agissant comme un stockage / broker de certificats.

Sentry est un service totalement optionnel. S'il n'est pas présent au démarrage des sidecars (et son adresse spécifié dans la commande de démarrage), les communications ne seront pas chiffrées.

Dapr possède donc une architecture modulaire, et il existe d'autres services optionnels :
- **[Placement](https://docs.dapr.io/concepts/dapr-services/placement/)** est un service optionnel permettant l'utilisation du [modèle Acteurs](https://fr.wikipedia.org/wiki/Mod%C3%A8le_d%27acteur)
- Le **[DNS](https://docs.dapr.io/reference/components-reference/supported-name-resolution/)** interne à Dapr est aussi modulaire. Par défaut, une résolution plate (mDNS) est utilisée, mais **coreDNS**(Kubernetes) ou bien **Consul** peuvent être utilisés selon les plateformes.
{% endcollapsible %}


### En application

Il est l'heure de reprendre le fil rouge. Cherchant toujours rendre notre application de pré-commande complète, deux nouveaux services sont ajoutés, toujours dans des langages différents:
- **stock-manager** (en Go): Une fois une commande validée par **order-processing**, **stock-manager** rajoute la commande aux stocks requis
- **receipt-generator** (en Rust): Une fois une commande validée par **order-processing**, **receipt-generator** génère une confirmation

Les deux services seront appelés par **order-processing**.

La nouvelle cible est donc: 

![Expected result](/media/lab2/service-invocation/step-2-service-invocation.png)


> **Question**: Quelle est l'URL que doit utiliser **order-processing** pour appeler **stock-manager** ? Expliquez.

> **Question**: Quelle est l'URL que doit utiliser **order-processing** pour appeler **receipt-generator** ? Expliquez.

> **En pratique**: A l'aide des deux questions précédentes, renseignez les variables d'environnements **RECEIPT_GENERATOR_INVOKE_URL** et **STOCK_MANAGER_INVOKE_URL** dans `docker-compose.yml`. Executez le fichier docker-compose et lancer une commande via l'interface.

La trace de succès devrait ressembler à :
![Expected result](/media/lab2/service-invocation/expected-result.png)

**Note** : Il est également possible de limiter quel(s) services(s) peuvent appeler un service. Pour cela un object configuration existe qui peut être passé en argument de chaque sidecar avec le switch de CLI **--config**. Voici un exemple où seul **order-processing** aurait le droit d'appeler le microservice.
```yml
apiVersion: dapr.io/v1alpha1
kind: Configuration
metadata:
  name: appconfig
spec:
  accessControl:
    defaultAction: deny
    policies:
    - appId: order-processing
      defaultAction: allow
```

Pour appliquer cette configuration à **receipt-generator par exemple il faudrait:

- Créer un dossier config et y enregistrer la configuration ci-dessus (avec pour exemple le nom `config.yml`)
- Modifier le docker-compose comme suit: 

```diff
  ############################
  # Receipt Generator
  ############################
  receipt-generator:
    #image: daprbuildworkshopacr.azurecr.io/receipt-generator
    build: ../implementations/receipt-generator
    depends_on:
      - redis
    networks:
      - hello-dapr
    environment:
      - RUST_LOG=debug
  receipt-generator-dapr:
    image: "daprio/daprd:edge"
    command: ["./daprd",
     "-app-id", "receipt-generator",
     "-app-port", "8081",
     "-dapr-grpc-port", "50002",
+    "-config /config/config.yml"
     "-components-path", "/components"]
    volumes:
        - "./components/:/components"
+       - "./config/config.yaml"
    depends_on:
      - receipt-generator
    network_mode: "service:receipt-generator"
```