---
sectionid: lab1-enterdapr
sectionclass: h2
title: Le role de Dapr
parent-id: lab-1
---

Le rôle de Dapr est de permettre une sorte de découplage architecturel. Au lieu de devoir lier les composants les uns aux autres, avec l'utilisation de bibliothèques spécifiques par exemple, nous allons pouvoir ajouter un degré d'abtraction supplémentaire permettant de généraliser le code.

Une version de l'application utilisant Dapr se trouve dans `src/Lab1-1-decoupling/withDapr`.

Cette nouvelle version est exécutable en utilisant la command suivante:

```shell
# Si make installé
make run
# Sinon
docker-compose up
```

> **Question**: Comparez les deux versions (avec et sans Dapr) du service NodeJS. Comment le service recupère t-il le message ?

Solution :

{% collapsible %}
Un appel est effectué sur le port 3500 de l'interface localhost du service. Ce port est le port par défaut de Dapr.

```ts
// src/Lab1/1-decoupling/withDapr/node/src/app.ts, line 9
const daprPort = env.DAPR_HTTP_PORT || 3500;
const stateStoreName = `statestore`;
const stateUrl = `http://localhost:${daprPort}/v1.0/state/${stateStoreName}`;
```

{% endcollapsible %}

> **Question**: Comment l'état est-il persisté à partir d'un appel localhost ?

**Indication** : Documentation sur le stockage d'état

Solution:
{% collapsible %}
![Première app avec Dapr](/media/lab1/first-app-dapr.png)

Pour persister un état, l'état est envoyé de l'application Node à son sidecar (Dapr) avec une url de la forme.

```shell
POST /state/{{storename}}
```

Dapr regarde alors ses composants et récupère le composant de gestion d'état de nom {{storename}}. Ce composant specifie l'hôte et les paramètres de connexions de l'implémentation du composant, ici Redis. L'appel est ensuite transfére vers Redis.
{% endcollapsible %}

> **En Pratique** : En vous servant [de la documentation dediée](https://docs.dapr.io/reference/components-reference/supported-state-stores/setup-mongodb/), migrez le gestionnaire de message de Redis à MongoDB

**Indication** : La base de données mongo est déjà présente dans le fichier `docker-compose.yml`, il faut l'utiliser

Solution:
{% collapsible %}
Pour changer le gestionnaire d'état de Redis vers MongoDb, il faut simplement changer le composant dédié, `src/Lab1/1-decoupling/withDapr/components/statestore.yaml`

En l'état le composant utilise Redis :
```yml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: pubsub
spec:
  type: pubsub.redis
  version: v1
  metadata:
  - name: redisHost
    value: redis:6379
  - name: redisPassword
    value: ""
```

Changer simplement le type du composant en mongodb et les identifiants d'accès permet de changer de gestionnaire d'état:

```yml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: statestore
spec:
  type: state.mongodb
  version: v1
  metadata:
  - name: host
    value: mongo:27017
  - name: username
    value: root
  - name: password
    value: example
  - name: databaseName
    value: admin
```
{% endcollapsible %}
