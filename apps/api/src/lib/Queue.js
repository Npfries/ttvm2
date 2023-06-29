import amqplib from "amqplib";

/** @type {string} */
// @ts-ignore
const AMQP_HOST = process.env.AMQP_HOST;

/** @type {string} */
// @ts-ignore
const TASKS_QUEUE_NAME = process.env.TASKS_QUEUE_NAME;

/** @type {string} */
// @ts-ignore
const RESULTS_QUEUE_NAME = process.env.RESULTS_QUEUE_NAME;

class Queue {
  /** @type {function | null} */ cb = null;
  /** @type {amqplib.Connection | null} */ connection = null;
  /** @type {amqplib.Channel | null} */ pushChannel = null;
  constructor() {
    this.init();
  }

  async init() {
    this.connection = await amqplib.connect(AMQP_HOST);

    const ch1 = await this.connection.createChannel();
    await ch1.assertQueue(RESULTS_QUEUE_NAME);

    this.pushChannel = await this.connection.createChannel();
    this.pushChannel.assertQueue(TASKS_QUEUE_NAME);

    // Listener
    ch1.consume(RESULTS_QUEUE_NAME, (msg) => {
      if (msg !== null && this.cb !== null) {
        // console.log("Received:", msg.content.toString());

        ch1.ack(msg);

        const content = msg.content.toString();
        this.cb(content);
      } else {
        console.log("Consumer cancelled by server");
      }
    });
  }

  /**
   *
   * @param {function} cb
   */
  next(cb) {
    this.cb = cb;
  }

  push(msg) {
    if (!this.pushChannel) return;

    const buffer = Buffer.from(msg.toString());
    this.pushChannel.sendToQueue(TASKS_QUEUE_NAME, buffer);
  }
}

export { Queue };
