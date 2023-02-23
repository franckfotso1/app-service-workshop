---
sectionid: lab1-enterdapr
sectionclass: h2
title: Paramètres du déploiement
parent-id: lab-1
---


Azure App Service permet un déploiement continu et manuel à partir des dépôts GitHub, Bitbucket et Azure Repos en extrayant les dernières mises à jour. Dans ce cas de figure, nous allons d'abord déoloyer le code de notre application depuis un référentiel Git sur notre ordinateur local.

Obtenez un référentiel Git local comprenant le code que vous souhaitez déployer. Pour télécharger un exemple de référentiel, exécutez la commande suivante dans la fenêtre de terminal locale :
git clone https://github.com/Azure-Samples/nodejs-docs-hello-world.git 
cd nodejs-docs-hello-world

Si vous disposez déjà d’une application App Service et que vous souhaitez configurer le déploiement Git local pour celle-ci, consultez plutôt Configurer une application existante

az webapp deployment source config-local-git --name <app-name> --resource-group <group-name>

La sortie contient une URL, telle que : https://<deployment-username>@<app-name>.scm.azurewebsites.net/<app-name>.git. Utilisez cette URL pour déployer votre application à l’étape suivante.