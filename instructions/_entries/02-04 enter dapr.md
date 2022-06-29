---
sectionid: lab1-enterdapr
sectionclass: h2
title: Le role de Dapr
parent-id: lab-1
---

Le rôle de Dapr est de permettre une sorte de découplage architecturel. Au lieu de devoir lier les composants les uns aux autres, avec l'utilisation de bibliothèques spécifiques par exemple, nous allons pouvoir ajouter un degré d'abstraction supplémentaire permettant de simplifier le code.

Plus important : ce découplage permet au développeur d'un service de se **décharger de la responsabilité de l'implémentation**.

C'est ce que nous allons tenter d'illustrer.

Pour cela, nous allons déployer une autre version de l'application présentée qui elle utilise Dapr. Cette application se trouve dans `src/Lab1-1-decoupling/withDapr`.

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
Un appel HTTP générique est effectué sur le port 3500 **de l'interface localhost** du service. Ce port est le port par défaut de Dapr.

```ts
// src/Lab1/1-decoupling/withDapr/node/src/app.ts, line 9
const daprPort = env.DAPR_HTTP_PORT || 3500;
const stateStoreName = `statestore`;
const stateUrl = `http://localhost:${daprPort}/v1.0/state/${stateStoreName}`;
```

En effet, Dapr fonctionne avec le principe du `sidecar`. Chaque service (application principale) que nous allons déployer va être accompagné d'une instance de Dapr (sidecar) qui s'execute dans la même "sandbox applicative" (~= l'interface localhost est partagée).

À chaque fois que l'application principale voudra effectuer une communication vers une autre service, elle pourra se contenter d'appeller son sidecar, qui lui se chargera de transmettre l'appel

{% endcollapsible %}

> **Question** : Dans le fichier `docker-compose.yml`, où sont les "sidecars" Dapr ? Comment partagent-ils leur interface localhost avec leurs applications principales ? Le conteneur Redis a t-il un sidecar ?

Solution:
{% collapsible %}

```yml
  # Application principale
  nodeapp:
    build: ./node
    ports:
      - "50002:50002"
    depends_on:
      - redis
      - mongo
    networks:
      - hello-dapr
  # Sidecar
  nodeapp-dapr:
    image: "daprio/daprd:edge"
    # Configuration du sidecar pour l'application node
    command: ["./daprd",
    # Id de l'application pour dapr.
    # Cet ID permet par la suite de faire de l'invocation de service (voir Lab2)
     "-app-id", "nodeapp",
    # Port d'écoute de l'application principale.
    # Utilisé quand le sidecar transmet des informations à l'application principale
     "-app-port", "3000",
    # Port utilisé pour communiquer entre les sidecars en gRPC
     "-dapr-grpc-port", "50002",
     # Où trouver les composants Dapr (question suivante)
     "-components-path", "/components"]
    volumes:
        - "./components/:/components"
    depends_on:
      - nodeapp
    # Cette instruction permet de partager la même interface réseau
    network_mode: "service:nodeapp"
```

Le conteneur Redis n'a pas de sidecar, puisque ce n'est pas un service mais seulement un moyen de communication. Il n'a pas besoin des fonctionnalités apportées par Dapr

{% endcollapsible %}

> **Question**: Toujours dans le `docker-compose.yml`, on peut remarquer qu'un volume nommé **components** est monté sur chacun des sidecars, que contient le dossier ? Quelle peut être l'utilisé du contenu ?

Solution:
{% collapsible %}

Ce dossier contient un fichier .yml ressemblant à ceci.

```yml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: statestore
spec:
  # Parmi les composants de gestion d'état, on selectionne Redis
  type: state.redis
  version: v1
  # On renseigne l'adresse et les identifiants de connexion à Redis
  metadata:
    - name: redisHost
      # On peut résoudre l'ip de Redis par son nom
      # grâce au réseau hello-dapr de Docker-compose
      value: redis:6379
    - name: redisPassword
      value: ""
```

Il s'agit d'une définition d'un **[composant](https://docs.dapr.io/concepts/components-concept/** Dapr. Ces composants sont une idée centrale de Dapr et ce sont eux qui permettent cette notion de découplage.
Ici, on annonce déclarativement que l'on veut utiliser Redis en tant que composant de stockage d'état.
Grâce à cette déclaration, tous les appels que les applications feront pour récupérer ou stocker un état seront
redirigé vers Redis.
Il suffirait de changer ce composant pour changer la déclaration.

{% endcollapsible %}

Avec toutes ces informations en tête, nous allons pouvoir faire un récapitulatif.

![Première app avec Dapr](/media/lab1/first-app-dapr.png)

Le chemin parcouru par notre état est le suivant :

- Le service Python communique l'état à son sidecar avec une URL de la forme :

```bash
# On retrouve dans l'URL l'id spécifié dans le sidecar du service Node.
# Cette url a pour but d'invoquer la méthode "neworder" sur le service "nodeapp"
# Nous verrons cela en détails dans le second lab
http://localhost:3500/v1.0/invoke/nodeapp/method/neworder
```

- Le sidecar du service python communique l'état au sidecar du service donc `-l'app-id` est celui spécifié dans l'URL, ici **nodeapp**
- Le sidecar du service Node transmet l'état au service Node
- le service node indique à son sidecar qu'il veut stocker un état dans le composant de stockage nommé {{storename}} avec un appel de la forme

```shell
POST /state/{{storename}}
```

- Dapr regarde alors ses composants et récupère le composant de gestion d'état de nom {{storename}}. Ce composant specifie l'hôte et les paramètres de connexion de l'implémentation du composant, ici Redis. L'appel est ensuite transféré vers Redis.

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
