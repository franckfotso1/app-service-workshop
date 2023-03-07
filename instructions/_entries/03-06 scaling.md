---
sectionid: lab2-scaling
sectionclass: h2
title: Autoscaling
parent-id: lab-2
---

- Une fois le déploiement effectué, nous allons mettre à l'échelle l'application. Mais avant, nous allons la déployer sur l'environnement de production by  Swap the staging slots.
  
#### partie swapping

Il existe deux workflows de mise à l’échelle dans App Service : scale-up et scale-out

{% collapsible %}
![Web App connection string](/media/lab1/asp_scaling.png)

> en faisant un **scale up**, vous bénéficiez d’un surcroît de capacité d’UC, de mémoire et d’espace disque, ainsi que de fonctionnalités supplémentaires, comme des machines virtuelles dédiées, des domaines et des certificats personnalisés, des emplacements intermédiaires, la mise à l’échelle automatique, et bien davantage. Pour monter en puissance en modifiant le niveau tarifaire du plan App Service auquel appartient votre application
---

> en faisant un **scale out**, vous augmentez le nombre d’instances de machine virtuelle qui exécutent votre application. Vous y trouverez comment utiliser la mise à l’échelle automatique, qui permet de mettre à l’échelle le nombre d’instances automatiquement en fonction des planifications et des règles prédéfinies

{% endcollapsible %}

#### Scale Web App to 3 Workers

```bash
az appservice plan update --number-of-workers 3 --name $APP_SERVICE_PLAN --resource-group $RESOURCE_GROUP
```

{% collapsible %}
![no scale up](/media/lab1/scale_up_not_available.png)
{% endcollapsible %}

#### Scale Up the App Service Plan to support custom autoscale

- Upgrade the pricing tier of the ASP.
{% collapsible %}
![scale up](/media/lab1/scale_up_asp.png)
{% endcollapsible %}

#### Configure Custom autoscaling
  
- Configure a custom autoscale on the production deployment slot.
{% collapsible %}
![Add a scale Rule](/media/lab1/custom_scale_out.png)
{% endcollapsible %}

- Add a rule
  
> The scale rule should use the CPU percentage to increase the resource count.
{% collapsible %}
![Add a scale Rule](/media/lab1/scale_rule.png)
{% endcollapsible %}

- Use Azure PowerShell to start an infinite loop that sends the HTTP requests to your web app.
  
```bash
# start an infinite loop that sends the HTTP requests to web app
$webapp = Get-AzWebApp -ResourceGroupName $rgName
while ($true) { Invoke-WebRequest -Uri $webapp.DefaultHostName }
```

- Confirm the resource count automatically scales

Dans **Process Explorer** (for Windows Apps), regardez le nombre d'instances s'accroitre.
