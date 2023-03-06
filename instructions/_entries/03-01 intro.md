---
sectionid: lab2-intro
sectionclass: h2
title: Contexte
parent-id: lab-2
---

Dans ce deuxième Lab, nous allons voir d'autres fonctionnalités ajoutées par AppService, à travers une nouvelle application qui évoluera au fur et à mesure des exercices.

Il faut cependant noter que le but de cet exercice n'est pas de s'intéresser au code de l'application mais plutôt de voir comment AppService nous fournit un certains nombre de briques intéressantes pour héberger notre code. A la fin de ce lab, vous disposerez d'une simple application application Express Js s’exécutant sur Azure App Service sur Linux  et connectée à une base de Azure Cosmos DB for MongoDB. (voir diagramme ci-dessous)

{% collapsible %}
![App Lab 2 overview](/media/lab1/lab_2_archi.png)
{% endcollapsible %}

Nous allons dans ce lab 2 :

- configurer les paramètres d'application   (appSettings)
- créer les environnement de déploiement    (Slot)
- configurer les paramètres de déploiement  (Github Actions)
- Configurer la mise à l'échelle            (scaling)
- Creer un nom de domaine personnalisé

Dans la suite nous allons explorer plus en détails ces fonctionnalités supplémentaires.
