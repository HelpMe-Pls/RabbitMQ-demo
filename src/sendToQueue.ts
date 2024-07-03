import amqp, { Channel, Connection } from "amqplib";
import { EmailData } from "./types";

const encodedPassword = encodeURIComponent(`!@#$%^&*()(*&^%$#@QWERTYZXC`);
const rabbitMQHost = `amqp://cloudflare:${encodedPassword}@103.35.67.164:5672`;

const QUEUE_NAME = "test_email-queue";

async function connectToRabbitMQ(): Promise<Channel> {
  const connection: Connection = await amqp.connect(rabbitMQHost);
  const channel: Channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  return channel;
}

export async function sendToQueue(message: EmailData): Promise<void> {
  const channel = await connectToRabbitMQ();
  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
  console.log("Message sent to queue");
  setTimeout(() => {
    channel.close();
  }, 500);
}

export { QUEUE_NAME, rabbitMQHost };
