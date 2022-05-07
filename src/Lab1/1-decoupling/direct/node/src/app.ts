import { IState } from "./@types/state";
import express from "express";
import Redis from "ioredis";
import { env } from "process";

/****
 * STATE HANDLING "SERVICE"
 **/
const redis = new Redis({ host: env.REDIS_HOST });
const stateStoreName = env.REDIS_COLLECTION;

async function persistState(state: IState): Promise<void> {
  const wasSaved = await redis.set(stateStoreName, JSON.stringify(state));
  if (!wasSaved) throw new Error(`Could not persist state`);
}

async function retrieveState(): Promise<IState> {
  const state = await redis.get(stateStoreName);
  if (!state) throw new Error(`Could not get state`);
  return JSON.parse(state);
}

/**
 * WEB SERVER
 */
const PORT = 3000;
const app = express();
app.use(express.json());

// Retrieve last order
app.get("/order", async (_req, res) => {
  res.send(await retrieveState());
});

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

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
  next();
});

app.listen(PORT, () => console.log(`Node App listening on port ${PORT}!`));
