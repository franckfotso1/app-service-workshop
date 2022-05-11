---
sectionid: lab1-codedive
sectionclass: h2
title: Plonger dans le code
parent-id: lab-1
---

En regardant le code des services Node et Python, répondre aux questions suivantes :

> **Question**: Par quel moyen les trois services communiquent-ils entre eux ?

Solution: 
{% collapsible %}
Les trois services communiquent **directement**:
- Le service Python appelle le service Node via un **appel HTTP** de l'URL de son serveur.
- Le service Node appelle Redis avec la bibliothèque **[ioredis](https://www.npmjs.com/package/ioredis**, qui elle-même encapsule le protocole **RESP**, le protocole spécifique à Redis.
{% endcollapsible %}

Imaginons que cette application est déployée en production depuis quelques temps. Cependant, après quelques mois, un nouveau besoin émerge : il faut migrer le support de stockage d'état de Redis vers MongoDB.

> **Question**: Quel serait l'impact de ce changement sur les services NodeJS et Python ? Proposez un protocole pour effectuer cette migration

Solution: 
{% collapsible %}
L'appel du service Python vers le service Node ne serait pas impacté.


Le code de l'application Nodejs cependant devrait forcément être réécrit. 
En effet, pour communiquer avec Redis, le service utilise la bibliothèque **[ioredis](https://www.npmjs.com/package/ioredis**. 
Cette bibliothèque n'a plus sa place dans le code si l'implémentation change de Redis à MongoDb.

C'est une des conséquence d'un **couplage applicatif fort**

{% endcollapsible %}
