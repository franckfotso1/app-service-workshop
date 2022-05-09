---
sectionid: lab2-monitoring
sectionclass: h2
title: Bindings
parent-id: lab-2
---

### Généralités

**Question généraliste** : Qu'est-ce qu'une _architecture orientée services_ ? Qu'est-ce qu'une architecture orientée événements\* ? Quelle est la différence entre les deux ?

Solution:
{%collapsible %}
**/!\ Approximations /!\\**
Une architetcure orientée services (SOA) est une architecture où une tâche à accomplir est répartie entre plusieurs programmes (services) s'appelant les uns les autres. Selon la part de responsabilité de chaque services, on peut les appeler microservices.

Une architecture orientée événement (EDA) est une architecture où la communication entre les composantes d'une application (qui peuvent être des services) est assurée au travers d'événements. Ces événements transitent généralement par des **bus d'événements**.

Deux différences importantes entre les deux :

- **Couplage**
  - En SOA les services sont couplés plus ou moins fortements (url à appeller, file de message...)
  - En EDA le couplage est lâche, ceux publiant des événements ne savent pas qui les écoutent et réciproquement
- **Cohérence**:
  - En SOA quand un service A appelle un Service B, l'état de Service A ne change que si l'appel à Service B est réussi (ex : HTTP 200)
  - En EDA quand un service A publie un événement et qu'un service B l'écoute, l'état de service A a déjà changé au moment de la publication, puisqu'il n'y a pas de retour de service B

Nous avons vu deux manière de pouvoir approcher la communication avec les deux derniers exercices, il reste maintenant la communication externe.

{% endcollapsible %}

### Dapr

A l'aide de la [documentation](https://docs.dapr.io/developing-applications/building-blocks/bindings/bindings-overview/), nous allons nous intéresser à ces questions

> **Question** : Quelle est l'utilité d'un _binding_ ?

> **Question** : Quelle est la différence entre un _input binding_ et un _output binding_ ? En quoi un _output binding_ est-il différent d'une invocation de service ?

> **Question** : Quelle est la différence entre un _input binding_ et un _output binding_ ?

### En application

Revenons une fois encore à notre fil rouge. Cette fois-ci, deux nouvelles demandes:
- Il faut maintenant pouvoir s'interfacer avec le système d'informations du fournisseur qui réapprovisionne notre stock. **Le service **stock-manager** a un endpoint HTTP POST specifique /newproduct**

Pour simuler ça, nous pouvons utiliser une tâche CRON. Si il est possible de l'utiliser directement dans l'application, nous pouvons utiliser un binding Dapr spécifique pour ça.

- La maison mère de l'entreprise dispose d'un service de mailing dedié.  Le service **receipt-generator** doit être capable d'envoyer des mails aux clients pour confirmer les pré-commandes. Le service de mailing est disponible à l'URL suivante : 

```shell
# Le paramètre "sig" de l'URL est volontairement faux, demandez la correction le jour du workshop 
https://prod-116.westeurope.logic.azure.com/workflows/0ceb8e48b2254276923acaf348229260/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=lTON4ZTisB1iGA-6rJAlkoC8miHB9kyJp3No
```

Comme les deux système avec lesquels nous devons intéragir sont externes, nous choississons d'utiliser des bindings. 

La cible est donc la suivante :

![Step 3](/media/lab2/bindings/app-step-3-bindings.png)


> **Question** : Quel binding utiliser pour le premier besoin ? Quelle est l'impact du nom du endpoint HTTP POST de reception de produit (**newproduct**) sur le binding ?

Solution :
{%collapsible %}
Etant donné que nous voulons **réagir à un événement lancé par un système externe**, nous devons utiliser un *input binding*.

Comme le système utilisé par le service externe est SignalR, nous pouvons utiliser le [binding CRON](https://docs.dapr.io/reference/components-reference/supported-bindings/cron/)

Le endpoint HTTP s'appelant newproduct, la propriété `metadata.name` du binding devra également s'appeller newproduct.

{% endcollapsible %}

> **Question** : Quel binding utiliser pour le deuxième besoin ?

Solution :
{%collapsible %}
Etant donné que nous voulons **faire parvenir un événement à système externe**, nous devons utiliser un *output binding*.

Comme le système utilisé par le service externe est une simple requête HTTP, nous pouvons utiliser le [binding HTTP](https://docs.dapr.io/reference/components-reference/supported-bindings/http/)

{% endcollapsible %}

> **En pratique** : Mettez en place les deux bindings et vérifiez leur fonctionnement. Pour vérifier que le service de mailing fonctionne, vous pouvez remplir la variable d'environnement **MAIL_TO** du service **receipt-generator** avec un email valide. L'expediteur du mail sera une adresse gmail avec l'objet "Validated Command"

Une trace indiquant le succès devrait avoir cette forme :

![Expected result](/media/lab2/bindings/expected-result.png)

### Par curiosité: Le "système externe"

Le système "externe" présenté est implenté comme suit:
- Le système de mailing est une Azure FonctionApp reliée à un compte gmail, déclenchée par l'appel HTTP du dessus.
![Mailing](/media/lab2/bindings/logic-app-mailing.png)




