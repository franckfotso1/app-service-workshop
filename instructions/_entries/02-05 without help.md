---
sectionid: lab1-withouthelp
sectionclass: h2
title: Le mode processus
parent-id: lab-1
---

Dans les exercices précédents, nous avons surtout travaillé avec des conteneurs, un fichier `docker-compose.yml` étant même fourni.

Il est cependant possible d'utiliser Dapr en mode processus, ce qui permet un processus de développement plus simple

> **En pratique** : Installez Dapr localement sur votre PC et initialisez votre environnement local.

**Indication** : [Documentation](https://docs.dapr.io/getting-started/). <u>Ne pas intialiser Dapr pour un environnement Kubernetes !</u>

> **Question** : Quels sont les conteneurs déployés par l'initilisation de Dapr ? Quel est le rôle de chacun ?

Solution:
{% collapsible %}
Les conteneurs déployés sont :

- Redis : En initialisant Dapr, une instance de Redis ainsi que le composant associé sont crées (dans le répertoire `~/.dapr/components`). Redis pouvant à la fois assurer les fonctionnalités de persistence d'état et de distribution de message, il est souvent choisi comme composant par défaut **dans les environnements de développement**
- Zipkin : [Logiciel Open-Source](https://github.com/openzipkin/zipkin) permettant de tracer les appels entre les services (Nous y reviendrons dans le _Lab2_)
- Placement : Un service de Dapr permettant d'utiliser le [modèle de programmation distribuée "Acteurs"](https://docs.dapr.io/developing-applications/building-blocks/actors/actors-overview/). Vous pourrez retrouver une explictaion détaillé du principe de ce modèle [ici](https://github.com/dotnet/orleans)
  {% endcollapsible %}

### Déployer une application en mode processus

Nous allons maintenant déployer l'application se trouvant dans le dossier `src/Lab2/1-without-help` en mode processus.

Puisque le type de déploiement que nous visons n'est pas conteneurisé, il va tout d'abord falloir installer les piles logicielles (_stacks_) de chaque service:

- Application Nodejs:
  - installer `nodejs` (>= 8.0)
  - installer les dépendances de l'application avec `npm install` (dans le dossier `src/Lab2/1-without-help/node`)
  - transpiler le Typescript en Javascript avec la commande `npm run build` (dans le dossier `src/Lab2/1-without-help/node`)
  - La commande pour lancer l'application est `node dist/app.js`.
- Service Python:
  - installer `python` (>= 3.0)
  - (l'application n'a pas de dépendances)
  - La commande pour lancer l'application est `python3 app.py`

> **En pratique**: en mode processus en utilisant la commande `dapr run` de Dapr.

**Indication** : Vous pouvez vous inspirer de cette [documentation de démarrage rapide](https://docs.dapr.io/getting-started/quickstarts/pubsub-quickstart/).

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

Ces deux modes de fonctionnement assurent une compatibilité avec des services Cloud comme du Kubernetes Managé (AKS) ou simplement de l'hébergement d'application en mode process (App Service\*)
