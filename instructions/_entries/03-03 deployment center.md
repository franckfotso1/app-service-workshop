---
sectionid: lab2-service-invocation
sectionclass: h2
title: Paramètres du déploiement et de l'application
parent-id: lab-2
---

### paramètres de déploiement

Azure App Service permet un déploiement continu et manuel à partir des dépôts GitHub, Bitbucket et Azure Repos en extrayant les dernières mises à jour. Dans cette étape, vous allez configurer le déploiement GitHub avec **GitHub Actions**. Cette méthode fait partie des nombreuses façons de déployer sur App Service, mais elle permet également de bénéficier d’une intégration continue dans votre processus de déploiement. Par défaut, chaque git push dans votre dépôt GitHub lance l’action de build et de déploiement.

Connectez-vous à votre compte GitHub et Fork [le repo](https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app) contenant les sources de l'application de ce Lab.

 Pour télécharger un exemple de référentiel, exécutez la commande suivante dans la fenêtre de terminal locale :

 ```bash
git clone https://github.com/franckfotso1/laravel-tasks.git
cd laravel-tasks
code .
 ```

 pour executer l'application localement :

- Dans .env, configurez les paramètres de base de données (par exemple DB_DATABASE, DB_USERNAME et DB_PASSWORD) à l’aide des paramètres de votre base de données MySQL locale. Vous avez besoin d’un serveur MySQL local pour exécuter cet exemple.

- À partir de la racine du dépôt, démarrez Laravel avec les commandes suivantes :
  
 ```bash
composer install
php artisan migrate
php artisan key:generate
php artisan serve
  ```

  Pour configurer le déploiement continu :

- aller dans **Deployment center**
- choisir **Github** comme source
- remplir les paramètres (organisation, repo, branch)
  
> Azure commits this workflow file into your selected GitHub repository to handle build and deploy tasks.To see the file before saving your changes, select **Preview file**

The GitHub Actions build provider is an option for CI/CD from GitHub. It completes these actions to set up CI/CD:

- Deposits a GitHub Actions workflow file into your GitHub repository to handle build and deploy tasks to App Service.
- Adds the publishing profile for your app as a GitHub secret. The workflow file uses this secret to authenticate with App Service.
- Captures information from the workflow run logs and displays it on the Logs tab in your app's Deployment Center.
You can customize the GitHub Actions build provider in these ways:

- Customize the workflow file after it's generated in your GitHub repository. For more information, see Workflow syntax for GitHub Actions. Just make sure that the workflow deploys to App Service with the azure/webapps-deploy action.
- If the selected branch is protected, you can still preview the workflow file without saving the configuration and then manually add it into your repository. This method doesn't give you log integration with the Azure portal.
- Instead of using a publishing profile, deploy by using a service principal in Azure Active Directory.
  
### Visualisez et collecter les logs de l'application

```bash
# Enable all logging options for the Web App
az webapp log config --name $APP_NAME --resource-group $RESOURCE_GROUP --application-logging azureblobstorage --detailed-error-messages true --failed-request-tracing true --web-server-logging filesystem

# Create a Web Server Log
curl -s -L $url/404

# Download the log files for review
az webapp log download --name $webapp --resource-group $resourceGroup
```

- Lab 1 hébergement d'une app (Plan, Web Apps, AppService, des STacks, LoadBalancing (), Paas donc géré, comment j'ai 2 web Apps sur un meme plan App Service)
- Lab 2 cycle de vie (slot, deployment center, scaling, appSettings)
- Lab 3 (j'observe, logs, kudo/kudu, remote debug, geny etc) / il ya observer les logs applicaitfs et les logs des ressources
- Lab 4 advanced concepts (authentification, identité managé, networking (private endpoint, vnet integration, custom domain, certificats), local cache)
- Lab 5 conteneur
