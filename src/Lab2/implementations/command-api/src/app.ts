import express from "express";
import fetch from "isomorphic-fetch";
import { env } from "process";

/****
 * PUB/SUB
 **/
const daprPort = env.DAPR_HTTP_PORT || 3500;
const topic = `orders`;
const pubSubName = `order-pub-sub`;
const stateUrl = `http://localhost:${daprPort}/v1.0/publish/${pubSubName}/${topic}`;

async function sendNewOrder(type: string): Promise<void> {
  const response = await fetch(stateUrl, {
    method: "POST",
    body: JSON.stringify({ type: type, qty: 1 }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok)
    throw new Error(`Could not publish order ${await response.text()}`);
}

/**
 * WEB SERVER
 */
const PORT = 80;
const app = express();
app.use(express.json());

// Post a new order
app.post("/neworder", async (req, res) => {
  const type = req.body.type;
  console.log("A new pair of charentaises has been ordered !");
  await sendNewOrder(type);
  res.status(200).send();
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
  next();
});

app.listen(PORT, () => console.log(`Node App listening on port ${PORT}!`));
