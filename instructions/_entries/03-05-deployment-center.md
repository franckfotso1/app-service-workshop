---
sectionid: lab2-deployment-center
sectionclass: h2
title: Paramètres du déploiement 
parent-id: lab-2
---

- Une fois l'emplacement de pré-production crée et les ressources provisonnées, nous alons **déployer** le code dessus.

### paramètres de déploiement

Azure App Service permet un déploiement continu et manuel à partir des dépôts GitHub, Bitbucket et Azure Repos en extrayant les dernières mises à jour. Dans cette étape, vous allez configurer le déploiement GitHub avec **GitHub Actions**. Cette méthode fait partie des nombreuses façons de déployer sur App Service, mais elle permet également de bénéficier d’une intégration continue dans votre processus de déploiement. Par défaut, chaque git push dans votre dépôt GitHub lance l’action de build et de déploiement.

Connectez-vous à votre compte GitHub et Forkez [le repo](https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app)

**Pour configurer le déploiement continu** :

- aller dans **Deployment center**
- choisir **Github** comme source
- remplir les paramètres (organisation, repo, branch)

{% collapsible %}
vérifiez que vous etes bien en environnement de staging
![Deployment center](/media/lab2/deployment_center.png)
{% endcollapsible %}

> Azure commit un fichier de flux de travail dans le référentiel GitHub sélectionné pour gérer les tâches de Build et de déploiement. Pour afficher le fichier avant d'enregistrer vos modifications, sélectionnez **Preview file**

Le fournisseur de build GitHub Actions effectue ces actions pour configurer la CI/CD :

- dépose un fichier de workflow GitHub Actions dans votre référentiel GitHub pour gérer les tâches de build et de déploiement sur App Service
- Ajoute le profil de publication de votre application en tant que secret GitHub. Le fichier de workflow utilise ce secret pour s'authentifier auprès d'App Service.
- Capture les informations des journaux d'exécution du flux de travail et les affiche dans l'onglet Journaux du centre de déploiement de votre application.

Apercu du fichier :
{% collapsible %}
![Workflow file](/media/lab2/workflow_file.png)
{% endcollapsible %}
  
Vous pouvez **personnaliser** le fournisseur de build GitHub Actions de cette manière:

- Personnalisez le fichier de workflow après sa génération dans votre référentiel GitHub. Assurez-vous simplement que le flux de travail se déploie sur App Service avec l'action azure/webapps-deploy.
- Au lieu d'utiliser un **profil de publication**, vous pouvez déployer à l'aide d'un **service principal** dans Azure Active Directory.
