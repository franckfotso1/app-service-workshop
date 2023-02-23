---
sectionid: lab1-codedive
sectionclass: h2
title: Emplacement de déploiement de pré-prodution
parent-id: lab-1
---

> Les organisations doivent souvent exécuter des applications web dans des environnements isolés pour les tester avant le déploiement. Dans une même application web Azure App Service, vous pouvez créer plusieurs emplacements de déploiement. Chaque emplacement est une instance distincte de cette application web avec un nom d’hôte différent. Vous pouvez déployer une version différente de votre application web dans chaque emplacement

**Creez un emplacement de pré-production avec le nom "staging"**.

{% collapsible %}

```bash
#Create a deployment slot with the name "staging".
az webapp deployment slot create --name $webapp --resource-group $resourceGroup --slot staging
```

{% endcollapsible %}

vérifiez la création de l'emplacement via le portail et notez l'URL :

![Deployment slot](/media/lab1/deployment_slot.png)
