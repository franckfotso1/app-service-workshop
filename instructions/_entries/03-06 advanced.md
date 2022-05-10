---
sectionid: lab2-advanced
sectionclass: h2
title: Quelques concepts avancés
parent-id: lab-2
---

### Les SDKs

Pendant l'intégralité du workshop, nous avons utilisé l'API REST de Dapr pour faire communiquer les services et leur sidecars. L'avantage de cette méthode est de permettre de de n'avoir aucune dépendance sur le service, tant que celui-ci est capable d'effectuer un appel HTTP, il est compatible avec Dapr.

Il existe cependant un certain nombres de SDKs officiels qui permettent de profiter au développement d'une aide syntaxique.

Le liste des sdk est disponible [ici](https://docs.dapr.io/developing-applications/sdks/)

### Métriques

Les métriques (CPU, RAM, uptime...) sont collectées et peuvent être traitées en utilisant un service managé (Azure Monitor, New Relic) ou hébergé localement Prometheus/Grafana.

Plus d'informations [ici](https://docs.dapr.io/operations/monitoring/metrics/prometheus/)

### Logs

Les logs des sidecars sont collectables en utilisant une solution comme FluentD, pour ensuite être envoté dans une solution d'analyse de logs comme log analytics ou une pile logicielle ELK (Elastisearch- Logstash - Kibana)
 Plus d'informations [ici](https://docs.dapr.io/operations/monitoring/logging/fluentd/)


### Tester avec Dapr

En utilisant Dapr vient rapidement une question : Comment tester un service utilisant Dapr ? Faut-il démarer le sidecar à chaque test unitaire ? Faut-il _mock-er_ les appels HTTP vers localhost:3500 ?

Si les deux réponses ci-dessous sont possibles, elles ont leurs inconvénients et pourront poser des problèmes dans un environnement de d'intégration continue.

Une solution plus élégante si le service le permet est d'utiliser une **injection de dépendance** du client Dapr.

#### Exemple

Considérant un service **ExternalStore** dont le seul but est de stocker l'état d'une application en dehors de celle-ci.

```ts
// ext-store.ts
@injectable()
export class ExtStore<T extends IStoreProxy> implements IRecordingStore {
  // 
  public static readonly STATE_KEY = "KEY";

  constructor(
    /** storeProxy peut être une instance de Dapr ou un Mock */
    @inject(TYPES.StoreProxy) private readonly storeProxy: T,
    /** Nom du composant Dapr */
    private readonly storeName: string
  ) {}

  async getState(): Promise<IRecordingState> {
    // Récupérer l'état via le proxy
    const state = await this.storeProxy.get(this.storeName, ExtStore.STATE_KEY)
    // Traitements...
    return state
  }

  async setState(state: IRecordingState) {...}

}

// Contraintes que doit respecter un proxy
export interface IStoreProxy {
  get(storeName: string, key: string): Promise<any>;
  save(storeName: string, [{ key: string, value: any }]): Promise<void>;
}

```

Dans notre conteneur d'injection de dépendances, nous pouvons fixer la valeur du proxy au gestionnaire d'état du client Dapr pour le cycle de vie normal de l'application

```ts
export const container = new Container();
// Le proxy est fixé à la valeur du client du SDK JS de DAPR
container.bind(TYPES.StoreProxy).toConstantValue(new DaprClient().state);
container
  .bind(TYPES.StateStore)
  .toConstantValue(
    new ExternalStore(
      container.get<IStoreProxy>(TYPES.StoreProxy),
      process.env.STORE_NAME
    )
  );

```

Dans les test unitaires, nous pouvons au contraire fixer la valeur du proxy à un valeur fixée. Dapr ne sera plus utilisé, ce qui enlève le besoin de le démarrer en plus de l'applications pour les tests, ce qui est de toute manière préférable pour ne pas "tester" le code de Dapr mais plutôt sa propre implémentation. 

```ts
describe("State store", () => {
  describe("GET", () => {
    it("Store empty", async () => {
      const ss = getDynamicExternalStore();
      const state = await ss.getState();
      expect(state).toBeUndefined();
    });
    it("Store non-empty", async () => {
      const mockData: IRecordingState = {
        recordsIds: ["0"],
      };
      const ss = getDynamicExternalStore(mockData);
      const state = await ss.getState();
      expect(state).toEqual(mockData);
    });
  });
});

function getDynamicExternalStore(startValue?: IRecordingState) {
  let state = startValue;
  // On remplace l'implémentation de Dapr par une pseudo-implémentation avant les tests
  const mockProxy: IStoreProxy = {
    get<T>(storeName: string, key: string): Promise<T> {
      return Promise.resolve(state as unknown as T);
    },
    save<T>(
      storeName: string,
      keyVal: readonly [{ key: any; value: any }]
    ): Promise<void> {
      state = keyVal[0].value;
      return Promise.resolve(undefined);
    },
  };
  return new ExternalStore(mockProxy, "");
}
```
