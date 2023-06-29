import { Executor } from "./lib/Executor.js";
import { Queue } from "./lib/Queue.js";

const queue = new Queue();
const executor = new Executor();

queue.next((msg) => {
  const result = executor.execute(msg);
  console.log(Date.now());
  queue.push(result);
});
