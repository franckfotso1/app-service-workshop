---
sectionid: lab3-app-insights
sectionclass: h2
title: Application insights
parent-id: lab-3
---


[Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview?tabs=net) vous permet de superviser les performances, les exceptions et l’utilisation de votre application sans modifier le code. Elle vous permet de diagnostiquer les erreurs sans attendre qu’un utilisateur les signale. Vous ajoutez le SDK à votre projet ou vous activez Application Insights à l’aide de l’agent Application Insights. l'agent peut instrumenter non seulement l’application de service web, mais aussi tous les composants d’arrière-plan et le code JavaScript des pages web elles-mêmes.(voir diagramme)

{% collapsible %}
![app_insights-arch](/media/lab3/app-insight-arch.png)
{% endcollapsible %}

Pour attacher **l’agent Application Insights** :

- Accédez à votre application web dans le portail.
  
- Sélectionnez Application Insights sous Paramètres

- puis sélectionnez Activer Application Insights.
  
- Sélectionnez ensuite une ressource Application Insights existante ou créez-en une.

- Enfin, sélectionnez Appliquer en bas.

{% collapsible %}

- activer l'agent App Insights

![app_insights](/media/lab3/app_insights.png)

- créer une ressource App Insights
  
![app_insights_create](/media/lab3/app_insights1.png)

- Observez l'ensemble des métriques et options disponibles
  
![app_insights_metrics](/media/lab3/app_insights_metrics.png)

{% endcollapsible %}

> Obtenez plus d'informations sur les éléments supervisés par Application Insights [ici](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview?tabs=net)
