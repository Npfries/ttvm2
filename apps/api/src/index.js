// import { VM } from "vm2";
import fastify from "fastify";
import cors from "@fastify/cors";
import fastifyIO from "fastify-socket.io";

import { Queue } from "./lib/Queue.js";

const app = fastify();
await app.register(cors, {
  // put your options here
});
app.register(fastifyIO, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

const queue = new Queue();

queue.next((msg) => {
  console.log("QUEUE RESULT:", msg);
  app.io.emit("test", msg);
});

app.post("/", async (req, res) => {
  /** @type {string} */
  // @ts-ignore
  const code = req.body;
  console.log("REQUEST:", code);

  queue.push(code);
  return {};
});

app.listen({ port: 3000, host: "0.0.0.0" });

app.ready().then(() => {
  // we need to wait for the server to be ready, else `server.io` is undefined
  app.io.on("connection", (socket) => {
    console.log("connected");
  });
});
