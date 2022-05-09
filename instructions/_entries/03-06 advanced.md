---
sectionid: lab2-advanced
sectionclass: h2
title: Quelques concepts avancés
parent-id: lab-2
---

### Les SDKs

Pendant l'intégralité du workshop, nous avons utilisé l'API REST de Dapr pour faire communiquer les services et leur sidecars. L'avantage de cette méthode est de permettre de de n'avoir aucune dépendance sur le service, tant que celui-ci est capable d'effectuer un appel HTTP, il est compatible avec Dapr.

Il existe cependant un certain nombres de SDKs officiels qui permettent de profiter au développement d'une aide syntaxique.

Le liste des sdk est disponible [ici](https://docs.dapr.io/developing-applications/sdks/)

### Tester avec Dapr

En utilisant Dapr vient rapidement une question : Comment tester un service utilisant Dapr ? Faut-il démarer le sidecar à chaque test unitaire ? Faut-il *mock-er* les appels HTTP vers localhost:3500 ? 

Si les deux réponses ci-dessous sont possibles, elles ont leurs inconvénients et pourront poser des problèmes dans un environnement de d'intégration continue. 

Une solution plus élégante si le service le permet est d'utiliser uen **injection de dépendance** du client Dapr.

#### Exemple

Considérant un service **StateStore** dont le seul but est de stocker l'état d'une application: 


