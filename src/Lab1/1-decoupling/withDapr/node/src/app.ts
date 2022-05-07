import { IState } from "./@types/state";
import express from "express";
import fetch from "isomorphic-fetch";
import { env } from "process";

/****
 * STATE HANDLING "SERVICE"
 **/
const daprPort = env.DAPR_HTTP_PORT || 3500;
const stateStoreName = `statestore`;
const stateUrl = `http://localhost:${daprPort}/v1.0/state/${stateStoreName}`;

async function persistState(state: IState): Promise<void> {
  const response = await fetch(stateUrl, {
    method: "POST",
    body: JSON.stringify(state),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok)
    throw new Error(`Could not persist state ${await response.text()}`);
}

async function retrieveState(): Promise<IState> {
  const query = await fetch(`${stateUrl}/order`);
  if (!query.ok) throw new Error(`Could not get state`);
  return JSON.parse(await query.text());
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
