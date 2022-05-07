---
sectionid: lab1-withouthelp
sectionclass: h2
title: Sans les roulettes
parent-id: lab-1
---

Dans les exercices précédents, était déjà déployé à l'aide d'un fichier `docker-compose.yml`. Cependant, dans un déploiement réel, il faudra commencer de zéro !

> **En pratique** : Installez Dapr localement sur votre PC et initialisez votre environnement local.

**Indication** : [Documentation](https://docs.dapr.io/getting-started/). Ne pas intialiser Dapr pour un environnement Kubernetes !

> **Question** : Quels sont les conteneurs déployés par l'initilisation de Dapr ? Quel est le rôle de chacun ?

Solution:
{% collapsible %}
TODO
Running a Redis container instance to be used as a local state store and message broker.
Running a Zipkin container instance for observability.
Creating a default components folder with component definitions for the above. DEFAULT PATH
Running a Dapr placement service container instance for local actor support. EXPLIQUER ACTERURS
{% endcollapsible %}

> **En pratique**: Déployez l'application dans `src/Lab2/1-without-help` en utilisant la CLI de Dapr.

**Indication** : Vous pouvez vous inspirer de cette [documentation de démarrage rapide](https://docs.dapr.io/getting-started/quickstarts/pubsub-quickstart/). 

**Indication 2** : Le type de déploiement que nous visons cette fois-ci est en mode processus. Pour pouvoir lancer les processus des deux applications il vous faudra : 
- Application Nodejs:
    - installer `nodejs` (>= 8.0)
    - installer les dépendances de l'application avec `npm install` (dans le dossier `src/Lab2/1-without-help/node`)
    - transpiler le Typescript en Javascript avec la commande `npm run build` (dans le dossier `src/Lab2/1-without-help/node`)
    - La commande pour lancer l'application est `node dist/app.js`. 
- Service Python:
    - installer `python` (>= 3.0) 
    - (l'application n'a pas de dépendances)
    - La commande pour lancer l'application est `python3 app.py`

**N'oubliez pas que le but est de démarrer les deux services à l'aide de la CLI de Dapr** 

Solution:
{% collapsible %}
Après avoir effectué les étapes d'installations, il suffit de lancer les commandes

```shell
# cwd: src/Lab2/1-without-help/node
dapr run --app-id nodeapp --components-path ../components --app-port 3000 -- node dist/app.js
# cwd: src/Lab2/1-without-help/python (autre shell)
# Note : Sous linux, l'executable de python est encore parfois appelé python3
dapr run --app-id pythonapp --components-path ../components -- python app.py
```
{% endcollapsible %}

### Récapitulatif

Dapr permet à la fois d'assister des applications conteneurisées (pattern du sidecar) mais aussi d'exécuter des processus.

Si la partie sidecar est indiquée dans des cas d'orchestration de conteneurs (Kubernetes, docker-compose, docker swarm...), la partie processus va nous permettre d'exécuter des applications localement sans avoir à penser à les conteneuriser.

Ces deux modes de fonctionnement assurent une compatibilité avec des services Cloud comme du Kubernetes Managé (AKS) ou simplement de l'hébergement d'application en mode process (App Service*) 