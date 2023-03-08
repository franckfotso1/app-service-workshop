---
sectionid: lab2-resources-creation
sectionclass: h2
title: Creation ressources
parent-id: lab-2
---

- Téléchargez et forkez les sources du projet [ici](https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app)
  
#### Définissons quelques variables d'environnement  

``` bash
$RESOURCE_GROUP = "my-rg"              # name of the resource group
$LOCATION = "northeurope"              # azure region where resources are hosted
$APP_NAME = "nodeapp256"               # name of the Todo Express Js Web app 
$APP_SERVICE_PLAN = "my-asp-app"       # name of the Linux App Service Plan
$COSMOSDB_ACCOUNT = "cosmosaccount23"  # name of the cosmosdb account
$APP_DATABASE = "nodeappdatabase23"    # name of the mongo database
$GIT_REPO = "https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app"
```

#### Créez un plan AppService Linux avec un tier Standard (minimum required for Slot)

Solution :

{% collapsible %}

```bash
# Create a standard app service plan with 2 Linux workers
az appservice plan create -g $RESOURCE_GROUP -n $APP_SERVICE_PLAN --is-linux --number-of-workers 2 --sku S1
```

{% endcollapsible %}

#### Créez une Web App sur ce plan App Service en spécifiant le runtime NODE 16

Solution :

{% collapsible %}

```bash
# get the list of supported runtimes for each Os
az webapp list-runtimes
# create the web app
az webapp create -g $RESOURCE_GROUP -n $APP_NAME -p $APP_SERVICE_PLAN -r "NODE:16-lts" 
```

{% endcollapsible %}

##### Créez une base de données Azure Cosmos DB for MongoDB

> C'est une base de données native Cloud qui propose une API 100 % compatible avec MongoDB.

Solution :

{% collapsible %}

```bash
# Create a new Cosmos DB account with MongoDB API
az cosmosdb create --name $COSMOSDB_ACCOUNT --kind MongoDB -g $RESOURCE_GROUP
```

```bash
# Create a new MongoDB database
az cosmosdb mongodb database create --account-name $COSMOSDB_ACCOUNT -g $RESOURCE_GROUP --name $APP_DATABASE
```

{% endcollapsible %}
