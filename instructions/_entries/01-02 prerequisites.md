---
sectionid: prereq
sectionclass: h2
title: Prérequis
parent-id: intro
---


### Prérequis

Ce workshop va demander les éléments suivants: 

- une subscription Azure (fournie dans le cadre de ce workshop)
- Azure CLI
- [Docker](https://www.docker.com/) et [docker-compose](https://docs.docker.com/compose/install/)
- un IDE

### Se connecter à sa souscription Azure 

En utilisant les identifiants qui vous ont été fournis, connectez vous à l'adresse <https://portal.azure.com>.

Pour le Lab 3, nous aurons également besoin de 

``` bash
az login
```

### Installer Azure CLI & l'extension pour Azure Container Apps

Suivez le lien pour installer [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli). Nous aurons besoin d'une version >= 2.36

**Note**: Vous pouvez connaître la version installée en exécutant la commande :
```csharp
az version
```
**Note**: Si az cli est déjà installé mais que vous n'avez pas la dernière version vous pouvez exécuter cette commande
```csharp
az upgrade
```

Une fois la CLI installé, installez l'extension de la CLI pour Azure Container Apps

``` csharp
az extension add -n containerapp
```