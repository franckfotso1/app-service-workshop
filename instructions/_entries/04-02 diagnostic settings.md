---
sectionid: lab3-logs-monitor
sectionclass: h2
title: Observabilité
parent-id: lab-3
---

#### Troobleshooting

> Quand vous exécutez une application web, vous souhaitez anticiper tout problème, des erreurs 500 à l’arrêt de votre site. Avec les diagnostics App Service, vous pouvez résoudre les problèmes de votre application de manière intelligente et interactive sans effectuer de configuration particulière.  les diagnostics App Service vous en indiquent la nature des problèmes de votre application afin que vous disposiez des informations appropriées pour les résoudre plus facilement et plus rapidement.
Cette fonctionnalité est particulièrement utile quand vous rencontrez des problèmes avec votre application au cours des dernières 24 heures, mais vous pouvez aussi analyser tous les graphiques de diagnostic à tout moment.

#### Ask Genie

{% collapsible %}

- La zone de recherche Génie permet de rapidement trouver un diagnostic. Par exemple si mon application est lent, je search "Web App Slow". Le même diagnostic est disponible dans les catégories Availability & Performance.
  
![Ask Genie](/media/lab1/ask_genie.png)
![Ask Genie diagnostic](/media/lab1/genie_diagnostic.png)

- On dispose aussi d'un Bot pour soumettre nos problèmes, et Genie nous fournit des recommandations
![Ask Genie 1](/media/lab1/ask_genie_1.png)

{% endcollapsible %}

#### Alertes de risques

La page d’accueil des diagnostics App Service effectue une série de vérifications de la configuration et formule des recommandations basées sur la configuration unique de votre application.

{% collapsible %}
![Alert](/media/lab1/app_alert.png)
{% endcollapsible %}

#### Activer la journalisation

Azure App Service capture tous les messages consignés dans la console pour vous aider à diagnostiquer les problèmes liés à votre application, aider au debogage. On a plusieurs types de journaux (applications, serveurs, erreurs détaillées, déploiement)

```bash
# Enable all logging options for the Web App
az webapp log config --name $APP_NAME --resource-group $RESOURCE_GROUP --application-logging azureblobstorage --detailed-error-messages true --failed-request-tracing true --web-server-logging filesystem
# Pour diffuser les journaux en temps réel 
# Pour filtrer des types de journaux spécifiques, tels que HTTP, utilisez le paramètre --Provider
az webapp log tail --name appname --resource-group myResourceGroup --provider http
# Download the log files for review
az webapp log download --name $webapp --resource-group $resourceGroup
```

#### Envoyez les journaux d'activité des serveurs Web dans un LogAnalytics Workspace

{% collapsible %}
![Logs](/media/lab1/nodeapp_logs.png)
{% endcollapsible %}

#### Visualisez et streamez les logs de l'app Express

 L’exemple d’application sort les messages du journal de la console dans chacun de ses points de terminaison pour illustrer cette capacité. Par exemple, le point de terminaison get génère un message sur le nombre de tâches récupérées dans la base de données et un message d’erreur s’affiche en cas de problème

```bash
router.get('/', function(req, res, next) {
  Task.find()
    .then((tasks) => {      
      const currentTasks = tasks.filter(task => !task.completed);
      const completedTasks = tasks.filter(task => task.completed === true);

      console.log(`Total tasks: ${tasks.length}   Current tasks: ${currentTasks.length}    Completed tasks:  ${completedTasks.length}`)
      res.render('index', { currentTasks: currentTasks, completedTasks: completedTasks });
    })
    .catch((err) => {
      console.log(err);
      res.send('Sorry! Something went wrong.');
    });
});
```

#### Azure Monitor

{% collapsible %}
![Logs_stream](/media/lab1/log_stream.png)
{% endcollapsible %}
"https://learn.microsoft.com/fr-fr/azure/app-service/tutorial-troubleshoot-monitor"
