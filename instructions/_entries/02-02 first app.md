---
sectionid: first-app
sectionclass: h2
title: Une première application
parent-id: lab-1
---

### Une première application

#### diagramme de l'architecture

![Première app](/media/lab1/first_app_lab_1.png)

Examinons quelques paramètres dont vous avez besoin pour créer une application App Service :

- le nom : le nom de l’application doit être unique
- Publier : App Service publie votre application sous forme de code ou conteneur Docker
- la pile d'exécution : langage, version du SDK
- le système d’exploitation : Linux ou Windows
- le plan App Service : l'application doit etre associée à un plan App Service pour établir les ressources et les capacités disponibles.

Définissons quelques variables d'environnement :

``` bash
$RESOURCE_GROUP = Franck-rg
$LOCATION = northeurope
$APP_NAME = webapp-workshop
$APP_SERVICE_PLAN = workshop-plan
```

**Avec ces variables, créez un groupe de ressources relatif à votre application**
{% collapsible %}

```bash
az group create --name $RESOURCE_GROUP --location "$LOCATION"
```

{% endcollapsible %}

**Créez un [plan AppService](https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans) avec un tier Standard (`minimum pour les emplacements de déploiement`)**
{% collapsible %}

```bash
az appservice plan create -g $RESOURCE_GROUP -n $APP_SERVICE_PLAN --is-linux --sku S1
```

{% endcollapsible %}

**Créez l'application web**
{% collapsible %}

```bash
#The web app's name must be able to produce a unique FQDN as AppName.azurewebsites.net
az webapp create -g $RESOURCE_GROUP -n $APP_NAME -p  $APP_PLAN -r “PHP:8.0”
```

{% endcollapsible %}

Une fois le déploiment effectué, Sélectionnez **Accéder à la ressource**. Pour avoir un apercu de l'application web, cliquez sur l'URL en haut à droite ou celui renvoyé par la CLI.

{% collapsible %}

![App overview](/media/lab1/web_app_overview.png)
![App UI default](/media/lab1/web_app_default_php_page.png)

{% endcollapsible %}
