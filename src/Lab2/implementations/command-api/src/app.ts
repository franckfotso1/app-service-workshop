import express from "express";
import fetch from "isomorphic-fetch";
import { env } from "process";

/****
 * PUB/SUB
 **/

async function sendNewOrder(type: string): Promise<void> {
  const psUrl = env.PUB_URL;
  if (psUrl === undefined || psUrl.length === 0) {
    throw new Error(`Couldn't send order to processing : PUB_URL invalid. Got "${env.PUB_URL}"`);
  }
  const response = await fetch(env.PUB_URL, {
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
  console.log("A new pair of charentaises has been ordered !");
  await sendNewOrder("charentaises");
  res.status(200).send();
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
  next();
});

app.listen(PORT, () => console.log(`Node App listening on port ${PORT}!`));
