---
sectionid: lab2-app-settings
sectionclass: h2
title: Définir les paramètres d'application
parent-id: lab-2
---

- Une fois les ressources provisonnées, nous allons connecter l'application à la base de données.

### Paramètres d'application

Dans App Service, les paramètres d’application sont des variables transmises comme des variables d’environnement au code de l’application. Vous pouvez accéder aux paramètres d’application à partir de la page de gestion de votre application, en sélectionnant **Configuration > Paramètres d’application**

> Les développeurs ASP.NET définissent les paramètres de l'application dans App Service comme ils le font avec appSettings dans Web.config ou appsettings.json, mais les valeurs dans App Service remplacent celles du fichier Web.config ou appsettings.json. Vous pouvez conserver les paramètres de développement (par exemple le mot de passe MySQL local) dans Web.config ou appsettings.json, mais garder les secrets de production (par exemple le mot de passe de la base de données MySQL Azure) en sécurité dans App Service. Le même code utilise vos paramètres de développement lorsque vous déboguez localement, et utilise vos secrets de production lorsque vous les déployez sur Azure. Une fois stockés, les paramètres d’application sont toujours chiffrés (chiffrement au repos).

#### Connectez la web app à la BD

```bash
# Get connection string for the database
$connstring = (az sql db show-connection-string --name $APP_DATABASE --server $APP_DB_SERVER \
--client ado.net --output tsv)

# Assign the connection string to an app setting in the web app
az webapp config connection-string set \
    -n $APP_NAME -g $RESOURCE_GROUP \
    --settings "SQLSRV_CONNSTR=$connstring" \
    --connection-string-type SQLAzure

## configure app parameters
az webapp config appsettings set --name $APP_NAME \
--resource-group $RESOURCE_GROUP \
--settings DB_HOST= appdbserver57.database.windows.net ## to move

az webapp config appsettings set --name $APP_NAME \
--resource-group $RESOURCE_GROUP \
--settings DB_USERNAME=$SERVER_ADMIN_USER

az webapp config appsettings set --name $APP_NAME \
--resource-group $RESOURCE_GROUP \
--settings DB_PASSWORD=$PASSWORD

az webapp config appsettings set --name $APP_NAME \
--resource-group $RESOURCE_GROUP \
--settings DB_DATABASE=$APP_DATABASE 

az webapp config appsettings set --name $APP_NAME \
--resource-group $RESOURCE_GROUP \
--settings APP_DEBUG=true 

az webapp config appsettings set --name $APP_NAME \
--resource-group $RESOURCE_GROUP \
--settings APP_KEY=base64:Dsz40HWwbCqnq0oxMsjq7fItmKIeBfCBGORfspaI1Kw=  ## to move or generate

az webapp config appsettings set --resource-group $groupName --name $appName --settings CS_ACCOUNT_NAME="@Microsoft.KeyVault(SecretUri=$csResourceKVUri)" CS_ACCOUNT_KEY="@Microsoft.KeyVault(SecretUri=$csKeyKVUri)"
```

#### paramères généraux (ARR affinity, SDK version, Command start)
