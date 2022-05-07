import express from "express";
import { env } from "process";
import fetch from "isomorphic-fetch";


/**
 * WEB SERVER
 */
const PORT = 80;
const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// Bounce it
app.post("/neworder", async (req, res) => {
  await fetch(`http://${env.COMMAND_API_HOST}/neworder`);
});

app.listen(PORT, () => console.log(`Node App listening on port ${PORT}!`));
