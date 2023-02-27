---
sectionid: first-app
sectionclass: h2
title: Une première application
parent-id: lab-1
---

### Une première application

#### diagramme de l'architecture

![Première app](/media/lab1/first_app_lab_1.png)

Examinons quelques paramètres dont vous avez besoin pour créer une application App Service :

- le nom : le nom de l’application doit être unique
- Publier : App Service publie votre application sous forme de code ou conteneur Docker
- la pile d'exécution : langage, version du SDK
- le système d’exploitation : Linux ou Windows
- le plan App Service : l'application doit etre associée à un plan App Service pour établir les ressources et les capacités disponibles.

Définissons quelques variables d'environnement :

``` bash
$RESOURCE_GROUP = Franck-rg         # name of the resource group
$LOCATION = francecentral           # the azure region where resources are hosted
$APP_NAME = webapp-workshop         # name of the Web application
$APP_SERVICE_PLAN = workshop-plan   # name of the App plan
$APP_DB_SERVER = appdbserver57 # name of the database server,respect naming convention or generate random
$APP_DATABASE = appdb576       # name of the database
$SERVER_ADMIN_USER = user123  # bad practice
$PASSWORD = SampleWebApp456@7 # bad practice
$START_IP = "0.0.0.0"
$END_IP = "0.0.0.0"

```

**Avec ces variables, créez un groupe de ressources relatif à votre application**
{% collapsible %}

```bash
az group create --name $RESOURCE_GROUP --location "$LOCATION"
```

{% endcollapsible %}

##### Créez un [plan AppService](https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans) avec un tier Standard (`minimum pour les emplacements de déploiement`)**

{% collapsible %}

```bash
az appservice plan create -g $RESOURCE_GROUP -n $APP_SERVICE_PLAN --is-linux --sku S1
```

{% endcollapsible %}

##### Créez l'application web

{% collapsible %}

```bash
#The web app's name must be able to produce a unique FQDN as AppName.azurewebsites.net
az webapp create -g $RESOURCE_GROUP -n $APP_NAME -p  $APP_SERVICE_PLAN -r "PHP:8.0" 
```

{% endcollapsible %}

Une fois le déploiment effectué, Sélectionnez **Accéder à la ressource**. Pour avoir un apercu de l'application web, cliquez sur l'URL en haut à droite du portail ou celui renvoyé par la commande suivante :

```bash
az webapp show -n $APP_NAME -g $RESOURCE_GROUP --query "defaultHostName"
```

{% collapsible %}

![App overview](/media/lab1/web_app_overview.png)
![App UI default](/media/lab1/web_app_default_php_page.png)

{% endcollapsible %}

##### Créez une base de donnée SQL

```bash
# Create a SQL Database server
echo "Creating $server"
az sql server create --name $APP_DB_SERVER --resource-group $RESOURCE_GROUP --location "$LOCATION" --admin-user $SERVER_ADMIN_USER --admin-password $PASSWORD
```

```bash
# Configure firewall for Azure access
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

##### Connectez la web app à la BD

```bash
# Get connection string for the database
connstring=$(az sql db show-connection-string --name $APP_DATABASE --server $APP_DB_SERVER \
--client ado.net --output tsv)

# Assign the connection string to an app setting in the web app
az webapp config connection-string set \
    -n $APP_NAME -g $RESOURCE_GROUP \
    --settings "SQLSRV_CONNSTR=$connstring" \
    --connection-string-type SQLAzure

## configure app parameters
az webapp config appsettings set --name $APP_NAME \
--resource-group $RESOURCE_GROUP \
--settings DB_HOST=appdbserver57.database.windows.net ## to move

az webapp config appsettings set --name $APP_NAME \
--resource-group $RESOURCE_GROUP \
--settings DB_USERNAME=$SERVER_ADMIN_USER

az webapp config appsettings set --name $APP_NAME \
--resource-group $RESOURCE_GROUP \
--settings DB_PASSWORD=$PASSWORD

az webapp config appsettings set --name $APP_NAME \
--resource-group $RESOURCE_GROUP \
--settings DB_DATABASE=$APP_DATABASE 

az webapp config appsettings set --name $APP_NAME \
--resource-group $RESOURCE_GROUP \
--settings APP_DEBUG=true 

az webapp config appsettings set --name $APP_NAME \
--resource-group $RESOURCE_GROUP \
--settings APP_KEY=base64:Dsz40HWwbCqnq0oxMsjq7fItmKIeBfCBGORfspaI1Kw=
```

> Une bonne pratique consiste notamment à automatiser le provisionement de son infrastructure à laide doutils Iac comme [Bicep](https://learn.microsoft.com/fr-fr/azure/app-service/provision-resource-bicep) ou [Terraform](https://learn.microsoft.com/fr-fr/azure/app-service/provision-resource-terraform).
