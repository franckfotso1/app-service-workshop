---
sectionid: first-app
sectionclass: h2
title: Une première application
parent-id: lab-1
---


### diagramme de l'architecture

{% collapsible %}
![Première app](/media/lab1/lab_1_archi.png)
{% endcollapsible %}

Examinons quelques paramètres dont vous avez besoin pour créer une application App Service :

- **le nom** : le nom de l’application doit être unique globallement
- **Publier** : App Service publie votre application sous forme de code ou conteneur Docker
- **la pile d'exécution** : langage, version du SDK
- **le système d’exploitation** : Linux ou Windows
- **le plan App Service** : l'application doit etre associée à un plan App Service pour établir les ressources et les capacités disponibles.

> D'autres applications peuvent également etre associées au **meme** plan donc utiliser les meme ressources.

#### Définissons quelques variables d'environnement  

``` bash
$RESOURCE_GROUP = "Franck-rg"         # name of the resource group
$LOCATION = "francecentral"           # azure region where resources are hosted
$APP_NAME_1 = "php_app"               # name of the PHP Web app
$APP_NAME_2 = "donet_app"             # name of the ASP.NET Core Web app 
$APP_SERVICE_PLAN = "my-asp-app"      # name of the Linux App Service Plan
$GIT_REPO = "https://github.com/Azure-Samples/php-docs-hello-world"
```

#### Avec ces variables, créez un groupe de ressources relatif à votre application

{% collapsible %}

```bash
az group create --name $RESOURCE_GROUP --location "$LOCATION"
```

{% endcollapsible %}

#### Créez un [plan AppService Linux](https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans) avec un tier Standard

Solution :

{% collapsible %}

```bash
# Create a standard app service plan with 2 Linux workers
az appservice plan create -g $RESOURCE_GROUP -n $APP_SERVICE_PLAN --is-linux --number-of-workers 2 --sku S1
```

{% endcollapsible %}

---
> le tier d'un plan App Service détermine les fonctionnalités App Service que vous obtenez et combien vous payez pour le plan. Par exemple, vos applications peuvent s'executer sur les machines virtuelles d'autres clients pour une option de **calcul partagé** ou peuvent s'executer sur des machines dédiées sur des réseaux virtuels dédiés  pour une option de **calcul isolé**.
Il existe plusieurs niveaux tarifaires pour chaque catégorie, plus le niveau est elevé et plus de fonctionnalités sont disponibles.

{% collapsible %}

![ASP tier ](/media/lab1/tier_app_service_plan.png)

{% endcollapsible %}

#### Lancer l'application php en local (optionel)

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

- via CLI

```bash
# get the list of supported runtimes for each Os
az webapp list-runtimes
# create the web app
az webapp create -g $RESOURCE_GROUP -n $APP_NAME_1 -p  $APP_SERVICE_PLAN -r "PHP:8.0" 
```

- via le Portail
  
![Web app 2 creation](/media/lab1/web-app-2.png)

{% endcollapsible %}

> The web app's name must be able to produce a unique FQDN as AppName.azurewebsites.net

{% collapsible %}
![App UI default](/media/lab1/php_app_quick.png)
{% endcollapsible %}

#### Exécutez la commande suivante pour déployer manuellement le code de l'application php depuis le repo Github

```bash
# Deploy code from a php app  public GitHub repository. 
az webapp deployment source config --name $APP_NAME_1 --resource-group $RESOURCE_GROUP \
--repo-url $GIT_REPO --branch master --manual-integration
```

Une fois le déploiment effectué, Sélectionnez **Accéder à la ressource**. Pour avoir un apercu de l'application web, cliquez sur l'URL en haut à droite du portail ou celui renvoyé par la commande suivante :

```bash
az webapp show -n $APP_NAME_1 -g $RESOURCE_GROUP --query "defaultHostName"
```

{% collapsible %}

![App overview](/media/lab1/overview_php_app.png)
![App UI default](/media/lab1/php_app_deploy.png)

{% endcollapsible %}

#### Créez l'application web ASP.NET Core

- Ouvrez Visual Studio 2022, puis sélectionnez Créer un projet
  
{% collapsible %}
![new project](/media/lab1/create_new_project.png)
{% endcollapsible %}

- Dans Créer un projet, recherchez et sélectionnez Application web ASP.NET Core, puis sélectionnez Suivant.
{% collapsible %}
![asp web app](/media/lab1/asp_web_app.png)
{% endcollapsible %}

- Dans Configurer votre nouveau projet, nommez l’application MyFirstAzureWebApp, puis sélectionnez Suivant
  
- Sélectionnez .NET Core 6.0 (prise en charge à long terme).
{% collapsible %}
![choose stack](/media/lab1/stack_asp.png)
{% endcollapsible %}

- Assurez-vous que Type d’authentification est défini sur Aucun et Sélectionnez Create (Créer)
  
#### Publiez l'application sur le meme plan App Service Linux

- cliquez avec le bouton droit sur le projet MyFirstAzureWebApp, puis sélectionnez Publier.
  
{% collapsible %}
![publish](/media/lab1/publish_asp.png)
{% endcollapsible %}

- Dans Publier, sélectionnez Azure, puis Suivant
 {% collapsible %}
![azure](/media/lab1/azure_asp.png)
{% endcollapsible %}
  
- Choisissez la cible spécifique, Azure App Service (Linux)

- Sélectionnez Ajouter un compte ou Connexion pour vous connecter à votre abonnement Azure
  
- À droite d’Instances App Service, sélectionnez + et choisir le nom, l'ASP et le RG
{% collapsible %}
![asp-deploy](/media/lab1/asp_app_deploy.png)
{% endcollapsible %}

- Dans la page Publier, sélectionnez Publier. Si vous voyez un message d’avertissement, sélectionnez Continuer.

> Visual Studio génère, empaquète et publie l’application web ASP.NET Core 6.0 sur Azure, puis la démarre dans le navigateur par défaut

#### Vérifiez la présence des deux Web Apps dans votre plan App Service Linux

{% collapsible %}

- via CLI

```bash
az webapp list -g $RESOURCE_GROUP -p $APP_SERVICE_PLAN --output table
```

- via Portail
  ![asp-deploy](/media/lab1/asp_list_app.png)

{% endcollapsible %}

---

> Une bonne pratique consiste notamment à automatiser le provisionement de son infrastructure à laide doutils Iac comme [Bicep](https://learn.microsoft.com/fr-fr/azure/app-service/provision-resource-bicep) ou [Terraform](https://learn.microsoft.com/fr-fr/azure/app-service/provision-resource-terraform).
