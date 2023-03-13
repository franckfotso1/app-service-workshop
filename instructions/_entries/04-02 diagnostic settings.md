---
sectionid: lab3-logs-monitor
sectionclass: h2
title: Observabilité
parent-id: lab-3
---

#### Gestion des erreurs

> Quand vous exécutez une application web, vous souhaitez anticiper tout problème, des erreurs 500 à l’arrêt de votre site. Avec les **diagnostics App Service**, vous pouvez résoudre les problèmes de votre application de manière intelligente et interactive sans effectuer de configuration particulière. Ils vous indiquent la nature des problèmes de votre application afin que vous disposiez des informations appropriées pour les résoudre plus facilement et plus rapidement.
Cette fonctionnalité est particulièrement utile quand vous rencontrez des problèmes avec votre application au cours des dernières **24 heures**, mais vous pouvez aussi analyser tous les graphiques de diagnostic à tout moment.

#### Ask Genie

{% collapsible %}

- La zone de recherche Genie permet de rapidement trouver un diagnostic. Par exemple si mon application est lent, je search **"Web App Slow"**. Le même diagnostic est disponible dans les catégories Availability & Performance.
  
![Ask Genie](/media/lab3/ask_genie.png)
![Ask Genie diagnostic](/media/lab3/genie_diagnostic.png)

- On dispose aussi d'un Bot sous l'option **Ask Genie** pour soumettre nos problèmes, et ce dernier nous fournit des recommandations
![Ask Genie 1](/media/lab3/ask_genie_1.png)

{% endcollapsible %}

#### Alertes

La page d’accueil des diagnostics App Service effectue une série de vérifications de la configuration et formule des recommandations basées sur la configuration unique de votre application.

{% collapsible %}
![Alert](/media/lab3/app_alert.png)
{% endcollapsible %}

#### Activez la journalisation et streamez les logs de l'application

Azure App Service capture tous les messages consignés dans la console pour vous aider à diagnostiquer les problèmes liés à votre application, aider au debogage. On a plusieurs types de journaux (applications, serveurs, erreurs détaillées, déploiement)

L’exemple d’application du **Lab2** sort les messages du journal de la console dans chacun de ses points de terminaison pour illustrer cette capacité. Par exemple dans le fichier **index.js**, le point de terminaison get génère un message sur **le nombre de tâches récupérées dans la base de données** et un message d’erreur s’affiche en cas de problème.

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

Ajoutez **une tache** à la ToDoApp et dirigez vous vers l'option **Log Stream**, Que remarquez vous ?

{% collapsible %}
![Logs_stream](/media/lab3/log_stream.png)
{% endcollapsible %}

```bash
# Activez toutes les options de journalisation de l'application 
az webapp log config --name $APP_NAME -g $RESOURCE_GROUP --application-logging azureblobstorage --detailed-error-messages true --failed-request-tracing true --web-server-logging filesystem
# Diffusez les journaux en temps réel et filtrer des types de journaux spécifiques tels que HTTP
az webapp log tail --name $APP_NAME -g $RESOURCE_GROUP --provider http
# Téléchargez les fichiers journaux pour une revue [la commande peut ne pas fonctionner avec les applications Web fonctionnant sous Linux]
az webapp log download --name $APP_NAME --resource-group $RESOURCE_GROUP
```

#### Azure Monitor

Lorsque vous avez des applications critiques et des processus métier basés sur des ressources Azure, vous voulez superviser ces ressources pour connaître leur disponibilité, leurs performances et leur fonctionnement. **Azure Monitor** optimise la disponibilité et les performances de vos applications et services en fournissant une solution complète pour collecter, analyser et utiliser la télémétrie de vos environnements cloud et locaux.

Nous allons :

- Configurer la ToDo App avec Azure Monitor et envoyer des journaux de console à Log Analytics.
- Utiliser des requêtes de journal pour identifier et résoudre les erreurs de l'application web

##### Creez un espace de travail Log Analytics

> Azure Monitor stocke les données de journal dans un espace de travail Log Analytics. Un espace de travail est un conteneur qui renferme des données ainsi que des informations de configuration.

{% collapsible %}

```bash
# nom de l'espace de travail Log Analytics
$APP_WORKSPACE = "my-log-workspace"  
# Créez le workspace
az monitor log-analytics workspace create -g $RESOURCE_GROUP --workspace-name $APP_WORKSPACE
```

{% endcollapsible %}

##### Envoyez les journaux d'activité des serveurs Web au LogAnalytics Workspace

{% collapsible %}

- via le Portail

![Logs](/media/lab3/nodeapp_logs.png)

- via CLI

```bash
# Récupérez l'ID de l'application Web
$resourceID = (az webapp show -g $RESOURCE_GROUP -n $APP_NAME --query id --output tsv)
# Récupérez l'ID du workspace Log Analytics
$workspaceID = (az monitor log-analytics workspace show -g $RESOURCE_GROUP  --workspace-name $APP_WORKSPACE --query id --output tsv)
# Créez un diagnostic settings
az monitor diagnostic-settings create --resource $resourceID \
 --workspace $workspaceID \
 -n my-app-logs \
 --logs '[{"category": "AppServiceConsoleLogs", "enabled": true},
  {"category": "AppServiceHTTPLogs", "enabled": true}]'
```

{% endcollapsible %}

##### Utiliser des requêtes de journal pour identifier et résoudre les erreurs d’une application

{% collapsible %}

- Allez dans votre Workspace Log Anaytics
- dans la section **Logs**, selectionner votre webapp comme **scope** et filtrer 'appservice'
- Requeter les logs de **"suppression de taches"** fournis par la console

![kusto_conso](/media/lab3/kusto_1.png)

- Diagnostiquer les erreurs HTTP 500 en utilisant la requete Kusto AppServiceHTTPLogs

![kusto_http](/media/lab3/kusto_2.png)

{% endcollapsible %}
