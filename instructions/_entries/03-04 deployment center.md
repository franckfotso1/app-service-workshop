---
sectionid: lab2-deployment-center
sectionclass: h2
title: Paramètres du déploiement 
parent-id: lab-2
---

- Une fois l'emplacement de pré-production crée et les ressources provisonnées, nous alons **déployer** le code dessus.

### paramètres de déploiement

Azure App Service permet un déploiement continu et manuel à partir des dépôts GitHub, Bitbucket et Azure Repos en extrayant les dernières mises à jour. Dans cette étape, vous allez configurer le déploiement GitHub avec **GitHub Actions**. Cette méthode fait partie des nombreuses façons de déployer sur App Service, mais elle permet également de bénéficier d’une intégration continue dans votre processus de déploiement. Par défaut, chaque git push dans votre dépôt GitHub lance l’action de build et de déploiement.

Connectez-vous à votre compte GitHub et Fork [le repo](https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app) contenant les sources de l'application de ce Lab.

 Pour télécharger un exemple de référentiel, exécutez la commande suivante dans la fenêtre de terminal locale :

 ```bash
git clone https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app.git
 ```

 **pour executer l'application localement** :

- Installez les dépendances des packages en exécutant **npm install**.
- Copiez le fichier .env.sample dans .env et renseignez la valeur DATABASE_URL avec votre URL MongoDB (par exemple, mongodb://localhost:27017/).
- Démarrez l’application à l’aide de **npm start**.
- Pour visualiser l’application, accédez à http://localhost:3000.

- Dans .env, configurez les paramètres de base de données (par exemple DB_DATABASE, DB_USERNAME et DB_PASSWORD) à l’aide des paramètres de votre base de données MySQL locale. Vous avez besoin d’un serveur MySQL local pour exécuter cet exemple.

  **Pour configurer le déploiement continu** :

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
