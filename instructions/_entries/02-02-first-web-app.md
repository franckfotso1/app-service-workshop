---
sectionid: first-app
sectionclass: h2
title: First application
parent-id: lab-1
---


### Architecture Diagram

{% collapsible %}
![First application](/media/lab1/lab_1_archi.png)
{% endcollapsible %}

Let's look at a few parameters you need to create an App Service app:

- **the name**: the name of the application must be globally unique
- **the publication format**: App Service publishes your application direclty from your code or using a Docker container
- **the execution stack**: language, SDK version
- **the operating system**: Linux or Windows
- **the App Service plan**: the application must be associated with an App Service plan to establish the available resources and capacities.

> Other applications can also be associated with the same App Service plan and therefore use the same resources.

#### Create a resource group

Let's start by creating the resource group for this Hand's On Lab.

> For the purpose of this lab we will create all the resources in the same region, for instance West US (westus) or North Europe (northeurope).

Remember, the naming convention for resource groups will be: `rg-<environment>-<region>-<application-name>-<owner>-<instance>`

{% collapsible %}

```bash
RESOURCE_GROUP="<your-resource-group-name>"
LOCATION="<your-region>"
az group create --name $RESOURCE_GROUP --location "$LOCATION"
```

{% endcollapsible %}

#### Create an App Service Plan 

To be able to deploy App Service you need to have a Service Plan associated to it which define the infrastructure properties you need.

Let's define a [Linux App Service Plan](https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans) with a Standard sku.

Remember, the naming convention for App Service Plan will be: `aps-<environment>-<region>-<application-name>-<owner>-<instance>`

Solution:

{% collapsible %}

```bash
APP_SERVICE_PLAN="<your-app-service-plan-name>"
# Create an App Service Standard plan with 4 Linux machine instances
az appservice plan create -g $RESOURCE_GROUP -n $APP_SERVICE_PLAN --is-linux --number-of-workers 4 --sku S1
```

{% endcollapsible %}

> The tier of an App Service plan determines which App Service features you get and how much you pay for the plan.

![APS tier](/media/lab1/tier_app_service_plan.png)


#### Launch the php application locally (optional)

```bash
# Clone the repository
git clone https://github.com/Azure-Samples/php-docs-hello-world
cd php-docs-hello-world
# Start the app locally
php -S localhost:8080
curl http://localhost:8080
```

#### Create an App Service

On this new this App Service Linux plan create an App Service with the PHP runtime.

Remember, the naming convention for App Service will be: `app-<environment>-<region>-<application-name>-<app-suffix><owner>-<instance>`

Solution:

{% collapsible %}

- via CLI

```bash
APP_NAME_1="<your-app-service-name>"
# Get the list of supported runtimes for each OS
az webapp list-runtimes
# Create the app service
az webapp create -g $RESOURCE_GROUP -n $APP_NAME_1 -p  $APP_SERVICE_PLAN -r "PHP:8.0" 
```

- via the Portal
  
![Web app 2 creation](/media/lab1/web-app-2.png)

{% endcollapsible %}

> un nom de domaine unique sous la forme **AppName.azurewebsites.net** sera attribuée à la web app

{% collapsible %}
![App UI default](/media/lab1/php_app_quick.png)
{% endcollapsible %}

#### Exécutez la commande suivante pour déployer manuellement le code de l'application php depuis le repo Github

```bash
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

- Dans Configurer votre nouveau projet, nommez l’application mydotnetapp, puis sélectionnez Suivant
  
- Sélectionnez .NET Core 6.0 (prise en charge à long terme).
{% collapsible %}
![choose stack](/media/lab1/stack_asp.png)
{% endcollapsible %}

- Assurez-vous que Type d’authentification est défini sur Aucun et Sélectionnez Create (Créer)
  
#### Publiez l'application sur le meme plan App Service Linux

- cliquez avec le bouton droit sur le projet mydotnetapp, puis sélectionnez Publier.
  
{% collapsible %}
![publish](/media/lab1/publish_asp.png)
{% endcollapsible %}

- Dans Publier, sélectionnez Azure, puis Suivant
 {% collapsible %}
![azure](/media/lab1/azure_asp.png)
{% endcollapsible %}
  
- Choisissez la cible spécifique, Azure App Service (Linux)

- Sélectionnez **Ajouter un compte ou Connexion** pour vous connecter à votre abonnement Azure
  
- À droite d’Instances App Service, sélectionnez + et choisir le nom, l'ASP et le RG puis sélectionnez Créer
{% collapsible %}
![asp-deploy](/media/lab1/asp_app_deploy.png)
{% endcollapsible %}

- Dans la page Publier, sélectionnez Publier. Si vous voyez un message d’avertissement, sélectionnez Continuer.

> Visual Studio build, génère un profil de publication et publie l’application web ASP.NET Core 6.0 sur Azure, puis la démarre dans le navigateur par défaut

#### Vérifiez la présence des deux Web Apps dans votre plan App Service Linux

{% collapsible %}

- via CLI

```bash
az webapp list -g $RESOURCE_GROUP -p $APP_SERVICE_PLAN --output table
```

- via Portail
  ![asp-deploy](/media/lab1/asp_list_app.png)

{% endcollapsible %}

#### Supprimez le groupe de ressources

{% collapsible %}

```bash
az group delete -n $RESOURCE_GROUP
```

{% endcollapsible %}

---

> Une bonne pratique consiste notamment à automatiser le provisionement de son infrastructure à laide doutils Iac comme [Bicep](https://learn.microsoft.com/fr-fr/azure/app-service/provision-resource-bicep) ou [Terraform](https://learn.microsoft.com/fr-fr/azure/app-service/provision-resource-terraform).
