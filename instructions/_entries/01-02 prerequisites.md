---
sectionid: prereq
sectionclass: h2
title: Prérequis
parent-id: intro
---

### Prérequis

Ce workshop va demander les éléments suivants:

- une souscription Azure
- Azure CLI (**>= 2.30**)
- [VS Code](https://code.visualstudio.com/) ou équivalent
- [un compte Github](https://github.com/join)
- [Docker](https://www.docker.com/) et [docker-compose](https://docs.docker.com/compose/install 
- [Les sources du workshop](https://aka.ms/daprartifacts) (Si le téléchargement ne fonctionne pas en cliquant, copiez l'URL du lien et collez là dans un nouvel onglet)

### Installer Azure CLI

#### Si CLI non installée : Installer le CLI

Suivez [ce lien](https://docs.microsoft.com/fr-fr/cli/azure/install-azure-cli) et suivez l'onglet correspondant à votre système d'exploitation.

#### Si CLI installée : Upgrade sa version du CLI

```bash
az version
# Si version az-core <= 2.30
az upgrade
```

#### Se connecter à sa souscription

Puis enfin connectez vous à votre souscription à l'aide de la commande suivante

{% collapsible %}

```bash
az login
# choisir la souscription 
az account set –s <SubscriptionID> 
# vérifier la souscription
az account show
```

connectez vous au portail : to <https://portal.azure.com>

{% endcollapsible %}  
