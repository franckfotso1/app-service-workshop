---
sectionid: lab2-monitoring
sectionclass: h2
title: Déployer le code sur l'environnement de pré-production
parent-id: lab-2
---

### Observer les chaînes d'appels

### Visualisez et collecter les logs de l'application (Tbd)

```bash
# Enable all logging options for the Web App
az webapp log config --name $APP_NAME --resource-group $RESOURCE_GROUP --application-logging azureblobstorage --detailed-error-messages true --failed-request-tracing true --web-server-logging filesystem

# Create a Web Server Log
curl -s -L $url/404

# Download the log files for review
az webapp log download --name $webapp --resource-group $resourceGroup
```
