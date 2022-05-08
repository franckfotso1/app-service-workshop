---
sectionid: lab2-pubsub
sectionclass: h2
title: Pub Sub
parent-id: lab-2
---

### Généralités

> **Question généraliste** : Qu'est-ce que le pattern _Publish Subscribe (PUB/SUB)_ ? A quel besoin repond t-il ?

### Dapr

A l'aide de la [documentation](https://docs.dapr.io/developing-applications/building-blocks/pubsub/), nous allons nous intéresser à ces questions

> **Question** : Comment fonctionne la fonctionnalité PUB/SUB de Dapr ? Quel est le chemin d'un message depuis son envoi de service A vers service B ?

> **Question** : Quelle est la garantie de livraison associée à la fonctionnalité de PUB/SUB ? Quels sont les avantages et les incovénients ?

> **Question** : Il existe deux méthodes pour souscrire à un _topic_ dans Dapr, quelles sont-elles ? Dans quels cas utiliser les deux ?

> **Ouverture** : Une fonctionnalité **en pré-version** est le routage basé sur le contenu (_Content-Based Routing_). Quel est le principe de cette fonctionnalité ? A quel besoin repond t-elle ?

### En application

Voici l'état actuel de l'application de pré-commande fil rouge :

![Step 0](/media/lab2/app-step-0.png)

Le frontend va être la vitrine de notre site, qui s'exécute sur le navigateur du client (raison pour laquelle il n'a pas de sidecar Dapr rattaché, non réaliste) et l'API la porte d'entrée de l'architecture du backend.

L'application peut être lancée en se rendant le dossier `src/Lab2/1-pub-sub` puis en lançant la commande

```shell
# docker-compose rm permet d'être sûr que les changements dans docker-compose.yml
# sont pris en compte
docker-compose rm -fsv ; docker-compose up
```

Le frontend devrait être disponible à l'adresse `localhost:8089`. Cliquer sur le boutton **Commander** permet de lancer une commande.

La prochaine étape dans le développement de cette application est de rajouter un service `order-processing` qui va recevoir et traiter les commandes.

Pour éviter de saturer le service en cas de forte affluence, nous allons opter pour un traitement asynchrone des commandes, en utilisant le pattern Pub/Sub (_Pas forcément idéal, voir Note 1_).

Voici donc la cible:

![Step 1](/media/lab2/pubsub/app-step-1-pubsub.png)

A noter:

- Chaque texte en violet est une variable d'environnement à remplir dans `src/Lab2/1-pub-sub/docker-compose.yml`
  - **PUB_URL** : URL appelée pour publier un message dans le composant de messages
- Chaque texte en vert est un endpoint HTTP ouvert:
  - **/process-order** : Endpoint HTTP POST de traitement de message

> **Question**: A l'aide du schéma ci dessus, identifier comment implémenter le PUB/SUB pour `command-api` et `order-processing` > **En pratique**: Implémenter le PUB/SUB entre `command-api` et `order-processing`

Une trace indiquant le success devrait avoir cette forme après avoir lancé une commande
![expected result](/media/Lab2/pubsub/expected-result.png)

**Note 1**: Dans un pattern Pub/Sub, un message est supprimé d'un _topic_ après que tous les consommateurs de ce topic l'ai reçu. Dans une véritable application E-commerce, où les microservices peuvent éventuellement _scaler_, c'est à dire multiplier leur nombre d'instances, les commandes pourraient être traitées plusieurs fois. La bonne approche dans ce genre de cas est d'utiliser une file de message, où le message sera supprimé après la première lecture.
