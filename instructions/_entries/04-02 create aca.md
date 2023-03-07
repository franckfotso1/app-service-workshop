---
sectionid: lab3-create-aca
sectionclass: h2
title: Observabilité
parent-id: lab-3
---

### Visualisez et collecter les logs de l'application (Tbd)

Azure App Service capture tous les messages consignés dans la console pour vous aider à diagnostiquer les problèmes liés à votre application. L’exemple d’application sort les messages du journal de la console dans chacun de ses points de terminaison pour illustrer cette capacité. Par exemple, le point de terminaison get génère un message sur le nombre de tâches récupérées dans la base de données et un message d’erreur s’affiche en cas de problème

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

Application Insights vous permet de superviser les performances, les exceptions et l’utilisation de votre application sans modifier le code. Pour attacher l’agent Application Insights, accédez à votre application web dans le portail. Sélectionnez Application Insights sous Paramètres, puis sélectionnez Activer Application Insights. Sélectionnez ensuite une ressource Application Insights existante ou créez-en une. Enfin, sélectionnez Appliquer en bas. Pour instrumenter votre application web à l’aide de PowerShell, consultez ces instructions.

Cet agent supervise votre application de Node.js côté serveur. Pour superviser votre code JavaScript côté client, ajoutez le SDK JavaScript à votre projet.

```bash
# Enable all logging options for the Web App
az webapp log config --name $APP_NAME --resource-group $RESOURCE_GROUP --application-logging azureblobstorage --detailed-error-messages true --failed-request-tracing true --web-server-logging filesystem

# Create a Web Server Log
curl -s -L $url/404

# Download the log files for review
az webapp log download --name $webapp --resource-group $resourceGroup
