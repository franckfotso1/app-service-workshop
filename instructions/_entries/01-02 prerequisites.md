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

### Installer Azure CLI

#### Si CLI non installée : Installer le CLI

Suivez [ce lien](https://docs.microsoft.com/fr-fr/cli/azure/install-azure-cli) et suivez l'onglet correspondant à votre système d'exploitation.

#### Si CLI installée : Upgrade sa version du CLI

{% collapsible %}

```bash
az version
# Si version az-core <= 2.30
az upgrade
```

{% endcollapsible %}

#### Se connecter à sa souscription

{% collapsible %}

```bash
az login
# choisir la souscription 
az account set –s <SubscriptionID> 
# vérifier la souscription
az account show
```

connectez vous au portail : <https://portal.azure.com>

{% endcollapsible %}
