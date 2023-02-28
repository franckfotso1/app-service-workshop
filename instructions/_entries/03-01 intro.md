---
sectionid: lab2-intro
sectionclass: h2
title: Contexte
parent-id: lab-2
---

Dans ce deuxième Lab, nous allons voir d'autres fonctionnalités ajoutées par AppService, à travers une nouvelle application qui évoluera au fur et à mesure des exercices. Cette fois il s'agira d'une application NodeJs sécurisée connectée à une base de données Mongo.

Il faut cependant noter que le but de cet exercice n'est pas de s'intéresser au code de l'application mais plutôt de voir comment AppService nous fournit un certains nombre de briques intéressantes pour héberger notre code. A la fin de ce lab, vous disposerez d'une application Express s'executant sur App Service sur Linux. (voir diagramme ci-dessous)

![App Lab 2 overview](/media/lab1/mongo_app_service.png)

Nous allons dans ce lab 2 :

- créer les environnement de déploiement    (Slot)
- configurer les paramètres de déploiement  (deployment Center / Github Actions)
- configurer les paramètres d'application   (appSettings)
- Configurer la mise à l'échelle            (scaling)
  
Dans la suite nous allons explorer plus en détails ces fonctionnalités supplémentaires.
