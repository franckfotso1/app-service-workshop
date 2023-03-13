---
sectionid: lab2-app-settings
sectionclass: h2
title: Paramètres d'application
parent-id: lab-2
---

- Une fois les ressources provisonnées, nous allons connecter l'application à la base de données.

### Paramètres d'application

Dans App Service, les paramètres d’application sont des variables transmises comme des variables d’environnement au code de l’application. Vous pouvez accéder aux paramètres d’application à partir de la page de gestion de votre application, en sélectionnant **Configuration > Paramètres d’application**

> Les développeurs ASP.NET définissent les paramètres de l'application dans App Service comme ils le font avec appSettings dans Web.config ou appsettings.json, mais les valeurs dans App Service remplacent celles du fichier Web.config ou appsettings.json. Vous pouvez conserver les paramètres de développement (par exemple le mot de passe MySQL local) dans Web.config ou appsettings.json, mais garder les secrets de production (par exemple le mot de passe de la base de données MySQL Azure) en sécurité dans App Service. Le même code utilise vos paramètres de développement lorsque vous déboguez localement, et utilise vos secrets de production lorsque vous les déployez sur Azure. Une fois stockés, les paramètres d’application sont toujours chiffrés (chiffrement au repos).

#### Démarrer l'application localement

```bash
# Clonez le dépôt
git clone https://github.com/Azure-Samples/msdocs-nodejs-mongodb-azure-sample-app.git
cd msdocs-nodejs-mongodb-azure-sample-app
# Installez les dépendances des packages
npm install
# Copiez le fichier .env.sample dans .env et renseignez la valeur DATABASE_URL avec votre URL MongoDB (par exemple, mongodb://localhost:27017/)
# Démarrez l’application 
npm start
# Accédez à http://localhost:3000
```

> Ouvrez le fichier **connection.js** dans le dossier **config** et notez les 2 variables dont vous aurez besoin pour connecter l'application à la BD. Que remarquez vous dans le fichier **app.js, ligne 17** ?

#### Connectez la web app à la BD

```bash
# Récupérez la 'chaîne de connexion' de votre base de données Mongo
az cosmosdb list-connection-strings -n $COSMOSDB_ACCOUNT -g $RESOURCE_GROUP
```

> Cette commande renverra un objet JSON contenant la chaîne de connexion de votre compte Cosmos DB. Copiez la valeur de la propriété **primaryConnectionString**

#### Attribuez la chaîne de connexion en tant que paramètre d'application à l'application Web

Solution :

{% collapsible %}

- via CLI
  
```bash
az webapp config appsettings set --name $APP_NAME \
--resource-group $RESOURCE_GROUP \
--settings DATABASE_URL = $primaryConnectionString DATABASE_NAME=$APP_DATABASE
```

- via le Portail

![Web App connection string](/media/lab2/app_settings.png)
> Pensez à enregistrer ses modifications
{% endcollapsible %}

#### paramères généraux

Outre les paramètres d'application, App Service fournit d'autres paramètres tels que :

```bash
az webapp config set --resource-group <group-name> --name <app-name> --use-32bit-worker-process [true|false] --web-sockets-enabled [true|false] --always-on [true|false]--http20-enabled --auto-heal-enabled [true|false] --remote-debugging-enabled [true|false] --number-of-workers
# ARR affinity, SDK version, Command start, etc ...
```

> **always-on** : Garde l'application chargée même s’il n'y a aucun trafic.Par défaut, l’application est déchargée après 20 minutes sans requêtes entrantes. Cela peut provoquer une latence élevée pour les nouvelles requêtes en raison de son temps de préparation. Lorsque l’option Always on est activée, l’équilibreur de charge frontal envoie une requête GET à la racine de l’application toutes les cinq minutes. La commande ping continue empêche le déchargement de l’application. Cette option peut etre utile pour les WebJobs continus.

---

> **remote debug** : Activez le débogage à distance pour les applications ASP.NET, ASP.NET Core ou Node.js. Cette option se désactive automatiquement au bout de 48 heures.
