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

#### Démarrer l'application localement

```bash
# clonez le repo
git clone https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app.git
cd msdocs-nodejs-mongodb-azure-sample-app
# Installez les dépendances des packages
npm install
# Copiez le fichier .env.sample dans .env et renseignez la valeur DATABASE_URL avec votre URL MongoDB (par exemple, mongodb://localhost:27017/)
# Démarrez l’application 
npm start
# accédez à http://localhost:3000
```

> Ouvrez le fichier **connection.js** dans le dossier **config** et notez les 2 variables dont vous aurez besoin pour connecter l'application à la BD. Que remarquez vous dans le fichier **app.js, ligne 17** ?

#### Connectez la web app à la BD

```bash
# Retrieve the connection string to your MongoDB database 
az cosmosdb list-connection-strings --name myCosmosDBAccount --resource-group myResourceGroup
```

> This command will return a JSON object containing the connection string for your Cosmos DB account. Copy the value of the **primaryConnectionString** property

#### Assign the connection string as an application setting in the web app

az webapp config appsettings set --name $APP_NAME \
--resource-group $RESOURCE_GROUP \
--settings DATABASE_URL = $primaryConnectionString DATABASE_NAME=$myDatabase

#### paramères généraux (ARR affinity, SDK version, Command start)
