---
sectionid: lab3-create-aca
sectionclass: h2
title: Créer un nouvel environnement ACA
parent-id: lab-3
---

Tout d'abord, il va nous falloir créer une nouvelle instance du service.

Pour cela, rendez vous sur le [portail Azure](https://portal.azure.com) et connectez-vous avec les identifiants qui vous ont été fournis. (voir [Pré-requis](#prereq))

Une fois sur le portail, cherchez dans la barre du haut "Container" jusqu'à trouver le resultat "Azure Container Apps"
![Portal Search bar](/media/lab3/portal-search-bar.png)

Cliquez sur le resultat, puis sur "**+ Create**".

Dans le nouvel écran, renseignez les informations demandées, en créant un nouveau groupe de ressources.

**/!\Notez le nom du groupe de ressource/!\\**

![Portal Search bar](/media/lab3/create-aca-basics.png)

Créez également un nouvel environnement. Remplissez les informations dans l'onglet Basics et cliquez sur "**Review + Create**" puis "**Create**".
![Aca env](/media/lab3/create-aca-env.png)

**/!\Notez le nom de l'environnement/!\\**

**Explication**:
Un **environnement** Containers Apps est un groupe dans lequel sont publiés des services. Tous les services publiés dans le même environement partage le même réseau (vNet), le même aggrégateur de logs (workspace Logs Analytics) et éventuellement les mêmes ressources de calcul sous-jacentes (si l'orchestrateur les affectes sur la même machine).
Pour que deux services puissent communiquer avec Dapr, ils doivent partager le même environnement.
![Aca env explanation](/media/lab3/create-aca-env-explanation.png)

Une fois l'environnement crée, cliquez sur "**Review + Create**" puis "**Create**". Une nouvelle instance de Azure Container Apps a été créée !
