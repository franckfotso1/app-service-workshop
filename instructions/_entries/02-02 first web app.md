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
  > D'autres applications peuvent également etre associés au meme plan donc utiliser les meme ressources.

Définissons quelques variables d'environnement :

``` bash
$RESOURCE_GROUP = Franck-rg         # name of the resource group
$LOCATION = francecentral           # the azure region where resources are hosted
$APP_NAME_1 = webapp-workshop-1     # name of the Web application 1
$APP_NAME_2 = webapp-workshop-2     # name of the Web application 2
$APP_SERVICE_PLAN = workshop-plan   # name of the App plan
$APP_DB_SERVER = appdbserver57 # name of the database server,respect naming convention or generate random
$APP_DATABASE = appdb576       # name of the database
$SERVER_ADMIN_USER = user123  # bad practice
$PASSWORD = SampleWebApp456@7 # bad practice
$START_IP = "0.0.0.0"
$END_IP = "0.0.0.0"
$GIT_REPO = https://github.com/Azure-Samples/php-docs-hello-world # Replace the following URL with your own public GitHub repo URL if you have one

```

**Avec ces variables, créez un groupe de ressources relatif à votre application**
{% collapsible %}

```bash
az group create --name $RESOURCE_GROUP --location "$LOCATION"
```

{% endcollapsible %}

##### Créez un [plan AppService](https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans) avec un tier Standard (`minimum pour les emplacements de déploiement && et auto-scale`)**

> le tier d'un plan App Service détermine les fonctionnalités App Service que vous obtenez et combien vous payez pour le plan. Par exemple, vos applications peuvent s'executer sur les machines virtuelles d'autres clients pour une option de **calcul partagé** ou peuvent s'executer sur des machines dédiées sur des réseaux virtuels dédiés  pour une option de **calcul isolé**

{% collapsible %}

```bash
# Create a standard app service plan Linux with 4/four Linux workers
az appservice plan create -g $RESOURCE_GROUP -n $APP_SERVICE_PLAN --is-linux --number-of-workers 4 --sku S1
```

{% endcollapsible %}

##### hébergez l'application web 1 - méthode 1

Exécutez la commande suivante pour cloner le référentiel de l’exemple d’application sur votre répertoire

```bash
git clone https://github.com/Azure-Samples/php-docs-hello-world
cd php-docs-hello-world
```

{% collapsible %}

```bash
# The web app's name must be able to produce a unique FQDN as AppName.azurewebsites.net
# Create a webapp and deploy code from a local workspace to the app. The command is required to run from the folder where the code is present
az webapp create -g $RESOURCE_GROUP -n $APP_NAME_1 -p  $APP_SERVICE_PLAN -r "PHP:8.0" 
# Deploy code from a public GitHub repository. 
az webapp deployment source config --name $APP_NAME_1 --resource-group $RESOURCE_GROUP \
--repo-url $GIT_REPO --branch master --manual-integration
```

{% endcollapsible %}

##### hébergez l'application web 2 - méthode 2

{% collapsible %}

```bash

#The web app's name must be able to produce a unique FQDN as AppName.azurewebsites.net
# Create a webapp, you will then need to deploy code to it
az webapp create -g $RESOURCE_GROUP -n $APP_NAME_2 -p  $APP_SERVICE_PLAN -r "PHP:8.0" 
```

{% endcollapsible %}

Une fois le déploiment effectué, Sélectionnez **Accéder à la ressource**. Pour avoir un apercu de l'application web, cliquez sur l'URL en haut à droite du portail ou celui renvoyé par la commande suivante :

```bash
az webapp show -n $APP_NAME_1 -g $RESOURCE_GROUP --query "defaultHostName"
az webapp show -n $APP_NAME_2 -g $RESOURCE_GROUP --query "defaultHostName"
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

> Une bonne pratique consiste notamment à automatiser le provisionement de son infrastructure à laide doutils Iac comme [Bicep](https://learn.microsoft.com/fr-fr/azure/app-service/provision-resource-bicep) ou [Terraform](https://learn.microsoft.com/fr-fr/azure/app-service/provision-resource-terraform).
