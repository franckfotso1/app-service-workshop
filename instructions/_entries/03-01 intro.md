---
sectionid: lab2-intro
sectionclass: h2
title: Contexte
parent-id: lab-2
---

Dans ce deuxième Lab, nous allons voir d'autres fonctionnalités ajoutées par AppService, à travers une nouvelle application qui évoluera au fur et à mesure des exercices.

Il faut cependant noter que le but de cet exercice n'est pas de s'intéresser au code de l'application mais plutôt de voir comment AppService nous fournit un certain nombre de briques intéressantes pour héberger notre code. A la fin de ce lab, vous disposerez d'une simple application Express Js s’exécutant sur Azure App Service sur Linux et connectée à une base de Azure Cosmos DB for MongoDB. (Voir diagramme ci-dessous)

{% collapsible %}
![App Lab 2 overview](/media/lab2/ex_arch_lab2.png)
{% endcollapsible %}

Nous allons dans ce lab 2 :

- configurer les paramètres d'application
- créer les environnements de déploiement
- configurer les paramètres de déploiement  
- configurer la mise à l'échelle
- rendre l'application hautement disponible

Dans la suite nous allons explorer plus en détails ces fonctionnalités supplémentaires.
