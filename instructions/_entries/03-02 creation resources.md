---
sectionid: lab2-resources-creation
sectionclass: h2
title: creation ressources
parent-id: lab-2
---

- Téléchargez et forkez les sources du projet [ici](https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app)
  
#### Définissons quelques variables d'environnement  

``` bash
$RESOURCE_GROUP = "Franck-rg"          # name of the resource group
$LOCATION = "northeurope"              # azure region where resources are hosted
$APP_NAME = "nodeapp256"               # name of the Todo Express Js Web app 
$APP_SERVICE_PLAN = "my-asp-app"       # name of the Linux App Service Plan
$myCosmosDBAccount = "cosmosaccount23" # name of the cosmosdb account
$myDatabase = "nodeappdatabase23"      # name of the mongo database
$APP_VAULT = "kv4789"                  # name of the Key vault
$GIT_REPO = "https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app"
```

#### Créez un plan AppService Linux avec un tier Standard (minimum required for Slot)

Solution :

{% collapsible %}

```bash
# Create a standard app service plan with four Linux workers
az appservice plan create -g $RESOURCE_GROUP -n $APP_SERVICE_PLAN --is-linux --number-of-workers 4 --sku S1
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
az cosmosdb create --name $myCosmosDBAccount --kind MongoDB -g $RESOURCE_GROUP
```

```bash
# Create a new MongoDB database
az cosmosdb mongodb database create --account-name $myCosmosDBAccount -g $RESOURCE_GROUP --name $myDatabase
```

```bash
# Create an Azure Key Vault to store credentials of .... (tbd)
az keyvault create --name $APP_VAULT -g $RESOURCE_GROUP -l $LOCATION
```

```bash
# Add a secret to the Azure key Vault
$SERVER_ADMIN_USER = $ (az keyvault secret set --vault-name $APP_VAULT --name SERVERADMINUSER --value <secret-value> --query id --output tsv ) # secret value = admin 
$PASSWORD = $ (az keyvault secret set --vault-name $APP_VAULT --name PASSWORD --value <secret-value> --query id --output tsv ) # secret value = password12376@ 
```

{% endcollapsible %}
