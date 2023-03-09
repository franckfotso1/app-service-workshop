---
sectionid: lab2-resources-creation
sectionclass: h2
title: Creation ressources
parent-id: lab-2
---

- Téléchargez et forkez les sources du projet [ici](https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app)
  
#### Définissons quelques variables d'environnement  

``` bash
$RESOURCE_GROUP = "my-rg"              # nom du groupe de ressources
$LOCATION = "northeurope"              # la region Azure où seront déployées les ressources
$APP_NAME = "nodeapp256"               # nom de la web app Express Js
$APP_SERVICE_PLAN = "my-asp-app"       # nom du plan App Service Linux
$COSMOSDB_ACCOUNT = "cosmosaccount23"  # nom du compte CosmosDB
$APP_DATABASE = "nodeappdatabase23"    # nom de la base de données mongo
$GIT_REPO = "https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app"
```

#### Créez un plan AppService Linux avec un tier Standard (minimum requis pour les Slots)

Solution :

{% collapsible %}

```bash
# Créez un plan App Service Standard avec 2 instances de machine Linux
az appservice plan create -g $RESOURCE_GROUP -n $APP_SERVICE_PLAN --is-linux --number-of-workers 2 --sku S1
```

{% endcollapsible %}

#### Créez une Web App sur ce plan App Service en spécifiant le runtime NODE 16

Solution :

{% collapsible %}

```bash
# Obtenez la liste des runtimes supportés pour chaque OS
az webapp list-runtimes
# Créez la web app
az webapp create -g $RESOURCE_GROUP -n $APP_NAME -p $APP_SERVICE_PLAN -r "NODE:16-lts" 
```

{% endcollapsible %}

##### Créez une base de données Azure Cosmos DB for MongoDB

> C'est une base de données native Cloud qui propose une API 100 % compatible avec MongoDB.

Solution :

{% collapsible %}

```bash
# Créez un nouveau compte Cosmos DB avec l'API MongoDB
az cosmosdb create --name $COSMOSDB_ACCOUNT --kind MongoDB -g $RESOURCE_GROUP
```

```bash
# Créez une nouvelle base de données MongoDB
az cosmosdb mongodb database create --account-name $COSMOSDB_ACCOUNT -g $RESOURCE_GROUP --name $APP_DATABASE
```

{% endcollapsible %}
