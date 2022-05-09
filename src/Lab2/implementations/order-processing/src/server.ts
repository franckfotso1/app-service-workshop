// VS Code : Deno initialize workspace
import "https://deno.land/x/dotenv@v3.1.0/load.ts";
import * as log from "https://deno.land/std@0.117.0/log/mod.ts";
// Requires deno 1.18.2 to run
// See https://github.com/keroxp/servest/issues/170
import { createApp } from "https://deno.land/x/servest@v1.3.4/mod.ts";

const PORT = Number(Deno.env.get("PORT") ?? 8080);
const app = createApp();

// TODO: Fill in which service to call
const daprPort = Deno.env.get("DAPR_HTTP_PORT") || 3500;
const service = ``;
const method = ``;
const stockUrl = `http://localhost:${daprPort}/v1.0/invoke/${service}/method/${method}`;

async function processOrder(type: string, quantity: number): Promise<void> {
  // Doing some check to ensure order is valid...
  // ...
  // Done

  log.info("Order processed ! Pub Sub has succeeded");
  const stockManagerUrl = Deno.env.get("STOCK_MANAGER_INVOKE_URL");
  const receiptGeneratorUrl = Deno.env.get("RECEIPT_GENERATOR_INVOKE_URL");

  const body = {
    type: type,
    qty: quantity,
  };
  const stockSuccess = await callIfUrlDefined(
    stockManagerUrl,
    "stock-manager",
    body
  );
  const receiptSuccess = await callIfUrlDefined(
    receiptGeneratorUrl,
    "receipt-generator",
    body
  );
  if (!stockSuccess || !receiptSuccess) {
    log.info(
      "Some services couldn't be called ! Service invocation have failed ! "
    );
  } else {
    log.info(
      "All services have been invoked ! Service invocation has succeeded ! "
    );
  }
}

async function callIfUrlDefined(
  url: string | undefined,
  service: string,
  requestBody: Record<string, any>
): Promise<boolean> {
  const isEmpty = (e: string | undefined) => e === undefined || e === "";

  if (isEmpty(url)) {
    log.info(
      `No ${service} service url to call. Wait for the Service Invocation step in the workshop`
    );
    return false;
  }

  log.info(`Calling ${service}...`);
  try {
    await callService(service, url as string, requestBody);
    log.info(`Called ${service} successfully !`);
    return true;
  } catch (e) {
    log.error(e.message);
    return false;
  }
}

async function callService(
  service: string,
  url: string,
  body: Record<string, any>
): Promise<void> {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `Couldn't call service ${service} : ${res.status} - ${await res.text()}`
    );
  }
}

app.post("/process-order", async (req) => {
  const bodyJson = (await req.json()).data as { type: string; qty: string };
  // qty is a positive integer
  const isQtyValid =
    bodyJson?.qty !== undefined &&
    !isNaN(Number(bodyJson?.qty)) &&
    Number(bodyJson.qty) > 0;

  // type is a plain string
  const isTypeValid =
    bodyJson?.type !== undefined && bodyJson?.type.length !== 0;

  if (!isTypeValid || !isQtyValid) {
    log.error("Invalid payload :");
    log.error(JSON.stringify(bodyJson));
    req.respond({
      status: 400,
      body: "Invalid arguments provided. Both qty and type must be provided, qty must be a positive integer",
    });
    return;
  }
  try {
    await processOrder(bodyJson.type, Number(bodyJson.qty));
    req.respond({ status: 204 });
  } catch (e) {
    req.respond({ status: 500, body: e.message });
  }
});

app.listen({ port: PORT });
log.info(`Server running at localhost:${PORT}`);
