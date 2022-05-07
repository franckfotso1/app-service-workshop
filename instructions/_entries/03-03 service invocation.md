---
sectionid: lab2-monitoring
sectionclass: h2
title: Invocation de Service
parent-id: lab-2
---


[L'invocation de Service](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/) est une fonctionnalité de Dapr permettant d'appeler directement une méthode sur un service sans avoir de conaissance sur la localisation du service. 

Le service Python de l'application présentée en exemple utilise cette fonctionnalité. 

> **Question**: Dans le code de du service Python, quelle est l'URL appelée ? Expliquez ses composantes.

Solution 
{% collapsible %}
L'URL est : 

```ts
"http://localhost:3500/v1.0/invoke/nodeapp/method/neworder"
```
En prenant chacune de ses composantes : 
- **http://localhost:3500** : Appel vers le sidecar (non chiffré, inutile car même sandbox applicative)
- **v1.0** : Version de l'API Dapr
- **invoke** : Utilisation de l'API d'invocation de service
- **nodeapp** : Nom du service à appeller
- **method** : Appel d'une méthode sur le service
- **neworder** : Nom de la méthode à appeler sur le service

{% endcollapsible %}

> **Question**: Quel est le nom de méthode du service node appellée par le service python ? Vérfiez son existence. Quelle est l'autre méthode exposée par le service node ?   

{% collapsible %}
La méthdoe appelée est neworder 

```ts
// Post a new order
app.post("/neworder", async (req, res) => {
  const data = req.body.data;
  const orderId = data.orderId;
  console.log("Got a new order! Order ID: " + orderId);

  const state: IState = [
    {
      key: "order",
      value: data,
    },
  ];
  await persistState(state);

  res.status(200).send();
});

```

L'autre méthode est la méthode **order**, qui permet de récupérer l'état stocké dans le statestore.

L'URL pour appeller cette méthode est :

```ts
"http://localhost:3500/v1.0/invoke/nodeapp/method/order"
```
{% endcollapsible %}



> **En pratique**: 

```
docker run --net="host" curlimages/curl
```

```yml
apiVersion: dapr.io/v1alpha1
kind: Configuration
metadata:
  name: appconfig
spec:
  accessControl:
    defaultAction: deny
    trustDomain: "public"
    policies:
    - appId: app1
      defaultAction: allow
      trustDomain: 'public'
      namespace: "default"

```