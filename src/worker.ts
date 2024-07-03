import amqp, { Channel, Connection } from "amqplib";
import { insertEmail } from "./db";
import { QUEUE_NAME, rabbitMQHost } from "./sendToQueue";
import { EmailData } from "./types";

export async function startWorker(): Promise<void> {
  try {
    const connection: Connection = await amqp.connect(rabbitMQHost);
    const channel: Channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log("Worker is waiting for messages...");

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        const emailData: EmailData = JSON.parse(msg.content.toString());
        console.log("Received:", emailData);

        try {
          await insertEmail(emailData);
          channel.ack(msg);
        } catch (error) {
          console.error("Error processing message:", error);
          // Optionally requeue the message
          // channel.nack(msg);
        }
      }
    });
  } catch (error) {
    console.error("Worker error:", error);
  }
}
