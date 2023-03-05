---
sectionid: lab2-pubsub
sectionclass: h2
title: creation ressources
parent-id: lab-2
---

- Téléchargez et forkez les sources du projet ici

#### Définissons quelques variables d'environnement  

``` bash
$RESOURCE_GROUP = "Franck-rg"         # name of the resource group
$LOCATION = "francecentral"           # azure region where resources are hosted
$APP_NAME = "donet_app"               # name of the ASP.NET Web app 
$APP_SERVICE_PLAN = "my-asp-app"      # name of the Windows App Service Plan
$APP_DB_SERVER = "db_server"          # name of the sql server
$APP_DATABASE = "db"                  # name of the sql database
$APP_VAULT = "kv"                     # name of the Key vault
$GIT_REPO = "https://github.com/Azure-Samples/php-docs-hello-world"
```

#### Créez un plan AppService Windows avec un tier Standard (minimum required for Slot)

Solution :

{% collapsible %}

```bash
# Create a standard app service plan with four Windows workers
az appservice plan create -g $RESOURCE_GROUP -n $APP_SERVICE_PLAN --is-linux false --number-of-workers 4 --sku S1
```

{% endcollapsible %}

#### Créez une Web App sur ce plan App Service Windows en spécifiant le runtime .NET 6

Solution :

{% collapsible %}

```bash
# get the list of supported runtimes for each Os
az webapp list-runtimes
# create the web app
az webapp create -g $RESOURCE_GROUP -n $APP_NAME -p $APP_SERVICE_PLAN -r "dotnet:6" 
```

##### Créez une base de données SQL

Solution :

{% collapsible %}

```bash
# Create an Azure Key Vault to store credentials of the SQL server
az keyvault create --name $APP_VAULT -g $RESOURCE_GROUP -l $LOCATION
```

```bash
# Add a secret to the Azure key Vault
$SERVER_ADMIN_USER = $ (az keyvault secret set --vault-name $APP_VAULT --name SERVER_ADMIN_USER --value <secret-value> --query id --output tsv ) # secret value = admin 
$PASSWORD = $ (az keyvault secret set --vault-name $APP_VAULT --name PASSWORD --value <secret-value> --query id --output tsv ) # secret value = password123 
```

```bash
# Create a SQL Database server
echo "Creating $server"
az sql server create --name $APP_DB_SERVER --resource-group $RESOURCE_GROUP --location "$LOCATION" --admin-user $SERVER_ADMIN_USER  --admin-password $PASSWORD
```

```bash
# Configure firewall for Azure access
$START_IP = "0.0.0.0" &  $END_IP = "0.0.0.0"
echo "Creating firewall rule with starting ip of $START_IP" and ending ip of $END_IP
az sql server firewall-rule create \
--server $APP_DB_SERVER \
--resource-group $RESOURCE_GROUP \
--name AllowYourIp \
--start-ip-address $START_IP --end-ip-address $END_IP
```

```bash
# Create an sql database 
echo "Creating $database"
az sql db create --server $APP_DB_SERVER \
--resource-group $RESOURCE_GROUP --name $APP_DATABASE \
--service-objective S0
```

{% endcollapsible %}
