---
sectionid: lab2-custom domain
sectionclass: h2
title: resilience
parent-id: lab-2
---

> Quand vous déployez votre application dans le cloud, vous choisissez une région dans ce cloud où est basée votre infrastructure d’application. Si votre application est déployée dans une seule région et que cette région devient indisponible, votre application sera elle aussi indisponible. La haute disponibilité et la tolérance de panne sont les composants clés d’une solution bien conçue. Mieux vaut se préparer et pour cela, une bonne solution est de déployer votre application et ses services dans plusieurs régions. Vous pouvez utiliser Azure Front Door pour router le trafic vers la région active. (voir diagramme)

{% collapsible %}
![Az front door](/media/lab1/az_front_door.png)
{% endcollapsible %}

Si vous souhaitez rendre votre application hautement disponible, consultez cette [documentation](https://learn.microsoft.com/fr-fr/azure/app-service/tutorial-multi-region-app)
