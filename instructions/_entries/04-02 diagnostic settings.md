---
sectionid: lab3-logs-monitor
sectionclass: h2
title: Observabilité
parent-id: lab-3
---

#### Gestion des erreurs

> Quand vous exécutez une application web, vous souhaitez anticiper tout problème, des erreurs 500 à l’arrêt de votre site. Avec les **diagnostics App Service**, vous pouvez résoudre les problèmes de votre application de manière intelligente et interactive sans effectuer de configuration particulière. les **diagnostics App Service** vous en indiquent la nature des problèmes de votre application afin que vous disposiez des informations appropriées pour les résoudre plus facilement et plus rapidement.
Cette fonctionnalité est particulièrement utile quand vous rencontrez des problèmes avec votre application au cours des dernières 24 heures, mais vous pouvez aussi analyser tous les graphiques de diagnostic à tout moment.

#### Ask Genie

{% collapsible %}

- La zone de recherche Génie permet de rapidement trouver un diagnostic. Par exemple si mon application est lent, je search "Web App Slow". Le même diagnostic est disponible dans les catégories Availability & Performance.
  
![Ask Genie](/media/lab1/ask_genie.png)
![Ask Genie diagnostic](/media/lab1/genie_diagnostic.png)

- On dispose aussi d'un Bot pour soumettre nos problèmes, et Genie nous fournit des recommandations
![Ask Genie 1](/media/lab1/ask_genie_1.png)

{% endcollapsible %}

#### Alertes

La page d’accueil des diagnostics App Service effectue une série de vérifications de la configuration et formule des recommandations basées sur la configuration unique de votre application.

{% collapsible %}
![Alert](/media/lab1/app_alert.png)
{% endcollapsible %}

#### Activer la journalisation et streamez les logs de l'application

Azure App Service capture tous les messages consignés dans la console pour vous aider à diagnostiquer les problèmes liés à votre application, aider au debogage. On a plusieurs types de journaux (applications, serveurs, erreurs détaillées, déploiement)

L’exemple d’application du Lab2 sort les messages du journal de la console dans chacun de ses points de terminaison pour illustrer cette capacité. Par exemple dans le fichier **index.js**, le point de terminaison get génère un message sur le nombre de tâches récupérées dans la base de données et un message d’erreur s’affiche en cas de problème.

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

Ajoutez une tache à la ToDoApp et dirigez vous vers l'option **Log Stream**

{% collapsible %}
![Logs_stream](/media/lab1/log_stream.png)
{% endcollapsible %}

```bash
# Enable all logging options for the Web App
az webapp log config --name $APP_NAME -g $RESOURCE_GROUP --application-logging azureblobstorage --detailed-error-messages true --failed-request-tracing true --web-server-logging filesystem
# diffuser les journaux en temps réel et filtrer des types de journaux spécifiques tels que HTTP
az webapp log tail --name $APP_NAME -g $RESOURCE_GROUP --provider http
# Download the log files for review [command may not work with web apps running on Linux]
az webapp log download --name $APP_NAME --resource-group $RESOURCE_GROUP
```

#### Azure Monitor

Lorsque vous avez des applications critiques et des processus métier basés sur des ressources Azure, vous voulez superviser ces ressources pour connaître leur disponibilité, leurs performances et leur fonctionnement. **Azure Monitor** optimise la disponibilité et les performances de vos applications et services en fournissant une solution complète pour collecter, analyser et utiliser la télémétrie de vos environnements cloud et locaux.

Scénario :
L’exemple d’application inclut le code destiné à saturer la mémoire et à générer des erreurs HTTP 500.
Nous allons :

- Configurer la ToDo App avec Azure Monitor et envoyer des journaux de console à Log Analytics.
- Utiliser des requêtes de journal pour identifier et résoudre les erreurs de l'application web

##### Creez un espace de travail Log Analytics

> Azure Monitor stocke les données de journal dans un espace de travail Log Analytics. Un espace de travail est un conteneur qui renferme des données ainsi que des informations de configuration.

{% collapsible %}

```bash
# name of the log analytics workspace
$APP_WORKSPACE = "my-log-workspace"  
# Create Log Analytics Workspace
az monitor log-analytics workspace create -g $RESOURCE_GROUP --workspace-name $APP_WORKSPACE
```

{% endcollapsible %}

##### Envoyez les journaux d'activité des serveurs Web au LogAnalytics Workspace

{% collapsible %}

- via le Portail

![Logs](/media/lab1/nodeapp_logs.png)

- via CLI

```bash
# Retrieve webapp ID
$resourceID = (az webapp show -g $RESOURCE_GROUP -n $APP_NAME --query id --output tsv)
# Retrieve log-analytics workspace ID
$workspaceID = (az monitor log-analytics workspace show -g $RESOURCE_GROUP  --workspace-name $APP_WORKSPACE --query id --output tsv)
# create a diagnostic settings
az monitor diagnostic-settings create --resource $resourceID \
 --workspace $workspaceID \
 -n my-app-logs \
 --logs '[{"category": "AppServiceConsoleLogs", "enabled": true},
  {"category": "AppServiceHTTPLogs", "enabled": true}]'
```

{% endcollapsible %}

##### Utiliser des requêtes de journal pour identifier et résoudre les erreurs d’une application

{% collapsible %}

- Requeter les logs de "suppression de taches" fournis par la console

![kusto_conso](/media/lab1/kusto_1.png)

- Diagnostiquer les erreurs HTTP 500 en utilisant la requete Kusto AppServiceHTTPLogs

![kusto_http](/media/lab1/kusto_2.png)

{% endcollapsible %}
