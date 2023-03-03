---
sectionid: first-app
sectionclass: h2
title: Une première application
parent-id: lab-1
---


### diagramme de l'architecture

![Première app](/media/lab1/first_app_lab_1.png)

Examinons quelques paramètres dont vous avez besoin pour créer une application App Service :

- **le nom** : le nom de l’application doit être unique globallement
- **Publier** : App Service publie votre application sous forme de code ou conteneur Docker
- **la pile d'exécution** : langage, version du SDK
- **le système d’exploitation** : Linux ou Windows
- **le plan App Service** : l'application doit etre associée à un plan App Service pour établir les ressources et les capacités disponibles.

> D'autres applications peuvent également etre associées au **meme** plan donc utiliser les meme ressources.

#### Définissons quelques variables d'environnement  

``` bash

$RESOURCE_GROUP = Franck-rg         # name of the resource group
$LOCATION = francecentral           # the azure region where resources are hosted
$APP_NAME_1 = php_app               # name of the PHP web app
$APP_NAME_2 = donet_app             # name of the ASP.NET web app 
$APP_SERVICE_PLAN = my-asp          # name of the Linux App Service Plan
$APP_DB_SERVER = appdbserver57      # name of the database server,respect naming convention or generate random
$APP_DATABASE = appdb576            # name of the database
$SERVER_ADMIN_USER = user123        # bad practice
$PASSWORD = SampleWebApp456@7       # bad practice
$GIT_REPO_1 = https://github.com/Azure-Samples/php-docs-hello-world # Replace the following URL with your own public GitHub repo URL if you have one
$GIT_REPO_2 = https://github.com/Azure-Samples/app-service-web-dotnet-get-started
```

#### Avec ces variables, créez un groupe de ressources relatif à votre application

{% collapsible %}

```bash
az group create --name $RESOURCE_GROUP --location "$LOCATION"
```

{% endcollapsible %}

#### Créez un [plan AppService] Linux (https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans) avec un tier Standard (`minimum pour les emplacements de déploiement && et mise à l'echelle automatique`)

Solution :

{% collapsible %}

```bash
# Create a standard app service plan with four Linux workers
az appservice plan create -g $RESOURCE_GROUP -n $APP_SERVICE_PLAN --is-linux --number-of-workers 4 --sku S1
```

{% endcollapsible %}

---
> le tier d'un plan App Service détermine les fonctionnalités App Service que vous obtenez et combien vous payez pour le plan.

Par exemple, vos applications peuvent s'executer sur les machines virtuelles d'autres clients pour une option de **calcul partagé** ou peuvent s'executer sur des machines dédiées sur des réseaux virtuels dédiés  pour une option de **calcul isolé**.
Il existe plusieurs niveaux tarifaires pour chaque catégorie, plus le niveau est elevé et plus de fonctionnalités sont disponibles.  
![ASP tier ](/media/lab1/tier_app_service_plan.png)

#### Lancer l'application php en local

```bash
# clone the repo
git clone https://github.com/Azure-Samples/php-docs-hello-world
cd php-docs-hello-world
# make it run locallly
php -S localhost:8080
curl http://localhost:8080
```

#### Créez une Web App sur ce plan App Service Linux en spécifiant le runtime PHP

Solution :

{% collapsible %}

```bash
# get the list of supported runtimes for each Os
az webapp list-runtimes
# create the web app
az webapp create -g $RESOURCE_GROUP -n $APP_NAME_1 -p  $APP_SERVICE_PLAN -r "PHP:8.0" 
```

> The web app's name must be able to produce a unique FQDN as AppName.azurewebsites.net

{% endcollapsible %}

#### Créez une 2e Web App sur ce plan App Service en spécifiant le runtime ASPNET

Solution :

{% collapsible %}

```bash
# create the web app 
az webapp create -g $RESOURCE_GROUP -n $APP_NAME_2 -p  $APP_SERVICE_PLAN -r "DOTNETCORE:6.0"
```

{% endcollapsible %}

> NB : App Service prend en charge différentes infrastructures de développement, telles qu’ASP.NET, ASP classique, Node.js, PHP et Python. Les infrastructures et les composants d’exécution fournis par la plateforme sont régulièrement **mis à jour** pour répondre aux exigences de sécurité et de conformité.

#### Exécutez la commande suivante pour déployer manuellement le code de l'application depuis le repo Github

```bash
# Deploy code from a public GitHub repository. 
az webapp deployment source config --name $APP_NAME_1 --resource-group $RESOURCE_GROUP \
--repo-url $GIT_REPO_2 --branch master --manual-integration
```

```bash
# Deploy code from a public GitHub repository. 
az webapp deployment source config --name $APP_NAME_2 --resource-group $RESOURCE_GROUP \
--repo-url $GIT_REPO_2 --branch master --manual-integration
```

Une fois le déploiment effectué, Sélectionnez **Accéder à la ressource**. Pour avoir un apercu de l'application web, cliquez sur l'URL en haut à droite du portail ou celui renvoyé par la commande suivante :

```bash
az webapp show -n $APP_NAME_1 -g $RESOURCE_GROUP --query "defaultHostName"
az webapp show -n $APP_NAME_2 -g $RESOURCE_GROUP --query "defaultHostName"
```

{% collapsible %}

![App overview](/media/lab1/web_app_overview.png)
![App UI default](/media/lab1/web_app_default_php_page.png)

{% endcollapsible %}

> Une bonne pratique consiste notamment à automatiser le provisionement de son infrastructure à laide doutils Iac comme [Bicep](https://learn.microsoft.com/fr-fr/azure/app-service/provision-resource-bicep) ou [Terraform](https://learn.microsoft.com/fr-fr/azure/app-service/provision-resource-terraform).
