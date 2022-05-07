---
sectionid: first-app
sectionclass: h2
title: Une première application
parent-id: lab-1
---

### Une première application
Le support de cette première activité sera l'application représentée ci-dessous. Le code de l'application peut-être trouvé dans le dossier `src/Lab1/1-decoupling-direct`  

![Première app](/media/lab1/first-app-vanilla.png)

Cette application est constituée de trois parties:
- Une instance de Redis pour permettre un stockage d'état.
- Une application stockant un état dans Redis
- Un service Python génère un état et l'envoie au service node


### Démarrer l'application en local

L'application peut être executée en local à l'aide de docker-compose.

```shell
    # Si make est installé
    make run
    # Sinon
    docker-compose up 
```
Une trace de ce type devrait être obtenue.
![Résultats](/media/lab1/first-app-vanilla-results.png)

