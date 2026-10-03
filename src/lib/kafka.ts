import { Kafka } from "kafkajs";

const kafkaBrokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(",") : [];
const hasKafka = kafkaBrokers.length > 0 || Boolean(process.env.ENABLE_KAFKA);

const kafka = hasKafka
  ? new Kafka({
      clientId: "formcraft",
      brokers: kafkaBrokers.length ? kafkaBrokers : ["localhost:9092"],
    })
  : null;

export const producer = kafka ? kafka.producer() : null;

let isConnected = false;

export async function connectProducer() {
  if (!producer || isConnected) return;
  try {
    await producer.connect();
    isConnected = true;
  } catch (err) {
    console.warn("Kafka connection skipped (falling back to direct storage):", err);
  }
}

export async function publishFormResponse(formId: string, payload: Record<string, unknown>): Promise<boolean> {
  if (!producer) return false;
  try {
    await connectProducer();
    if (!isConnected) return false;
    await producer.send({
      topic: "form-responses",
      messages: [{ key: formId, value: JSON.stringify(payload) }],
    });
    return true;
  } catch (err) {
    console.warn("Kafka message publication skipped:", err);
    return false;
  }
}

