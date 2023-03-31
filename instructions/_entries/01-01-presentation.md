---
sectionid: discover
sectionclass: h2
title: Avant-propos
parent-id: intro
---

[Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/) est un service pour l’hébergement d’applications web, d’API REST, et de backends mobiles. Il offre une mise à l’échelle automatique, une gestion automatisée, et une sécurité pour vos différentes applications s'exécutant dans des environnements Windows ou Linux.

Pourquoi App Service ?

C’est un service **Paas complètement managé** pour les développeurs offrant cette liste non exhaustive de fonctionnalités :

- **Plusieurs langages et frameworks** : offre une prise en charge pour .NET, Java, Ruby, Node.js, PHP, ou Python.
- **Mise à l’échelle globale avec une haute disponibilité** : héberge vos applications n’importe où et bénéficiez de la haute disponibilité de son SLA
- **Infrastructure de production managée** : met à jour l’os, les frameworks et vous permet de vous concentrer sur le code applicatif.
- **Conteneurisation** : dockerisez votre application et hébergez un conteneur Windows ou Linux. utilisez Docker Compose pour une application multi conteneurs.
- **DevOps** : configurez l’intégration et le déploiement continu avec Azure DevOps, GitHub, BitBucket, etc (voir source).
- **Sécurité et conformité** : Authentifiez les utilisateurs avec Azure AD, Google, Facebook, Twitter ou même un compte Microsoft, certi
- **Connexion aux plateformes Saas** : connectez vous à vos systèmes d’entreprises tels que SAP, Salesforce, etc.
- **Modèles d’application** : tirez parti d’une liste complète de modèles d’applications sur Azure Marketplace, tels que WordPress.

Azure offre d’autres services qui peuvent être utilisés pour l’hébergement de sites et d’applications web. Pour la plupart des scénarios, App Service est le meilleur choix. Si vous avez besoin d’avantage de contrôle sur les machines virtuelles exécutant vos applications, utilisez plutôt [Azure Virtual Machine](https://learn.microsoft.com/en-us/azure/virtual-machines/). Par contre, orientez vous vers [ASA](https://learn.microsoft.com/en-us/azure/spring-apps/), [Service Fabric](https://learn.microsoft.com/en-us/azure/service-fabric/), ou [ACA](https://learn.microsoft.com/en-us/azure/container-apps/) pour une architecture de microservices.  

Avec App Service, vous payez pour les ressources de calcul Azure que vous utilisez.
ces ressources sont déterminées par **le plan App Service** sur lequel sont exécutées vos applications.
