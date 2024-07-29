import amqp, { Connection, Channel } from "amqplib";
import configKeys from "../../config";

let connection: Connection;

async function connect(): Promise<void> {
  try {
    connection = await amqp.connect("amqp://localhost:5672");
    // Replace with your RabbitMQ server details
    console.log("Successfully connected to RabbitMQ");
  } catch (error) {
    console.log('error ',error);
    
  }
}

async function publishMessage(
  exchange: string,
  queue: string,
  message: Record<string, any>
): Promise<void> {
  const channel: Channel = await connection.createChannel();
  await channel.assertExchange(exchange, "direct", { durable: true });
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
}

// ... other functions for consuming and handling messages

export { connect, publishMessage };
