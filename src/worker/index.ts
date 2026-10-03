import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { Kafka } from "kafkajs";
import { createClient } from "redis";
import { connectToDatabase } from "../lib/db";
import { Form } from "../models/Form";
import { Notification } from "../models/Notification";
import { Response as FormResponse } from "../models/Response";
import { getResend } from "../lib/resend";
import { newResponseEmail } from "../lib/emails/newResponse";
import { confirmationEmail } from "../lib/emails/confirmation";
import type { FormField } from "../types";

const kafka = new Kafka({
  clientId: 'formcraft-worker',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'form-processing-group' });

const redisClient = createClient({
  url: 'redis://localhost:6379'
});

async function processMessage(payloadStr: string) {
  const payload = JSON.parse(payloadStr);
  const { formId, answers, metadata, _id, isComplete, createdAt } = payload;

  const response = await FormResponse.create({
    _id,
    formId,
    answers,
    metadata,
    isComplete,
    createdAt
  });

  const form = await Form.findById(formId);
  if (!form) return;

  await Form.updateOne({ _id: formId }, { $inc: { responseCount: 1 }, $set: { lastResponseAt: createdAt } });
  
  await Notification.create({
    userId: form.userId,
    type: "new_response",
    title: "New response",
    message: `You received a new response on ${form.title}`,
    formId,
  });

  // Emit to Redis for Socket.io
  await redisClient.publish(`form-updates:${formId}`, JSON.stringify({
    type: 'NEW_RESPONSE',
    data: response
  }));

  const resend = getResend();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  
  const fields = form.fields as FormField[];

  if (resend && form.settings?.notifications?.sendNotificationToOwner) {
    const ownerEmail = form.settings.notifications.notificationEmail;
    if (ownerEmail) {
      const email = newResponseEmail({ formTitle: form.title, formId, fields, answers, appUrl });
      await resend.emails.send({ from: process.env.EMAIL_FROM ?? "FormCraft <noreply@example.com>", to: ownerEmail, ...email });
    }
  }

  if (resend && form.settings?.notifications?.sendConfirmationToRespondent) {
    const emailField = fields.find((field: FormField) => field.type === "email");
    const recipient = emailField ? answers[emailField.id] : null;
    if (typeof recipient === "string" && recipient.includes("@")) {
      const email = confirmationEmail({ formTitle: form.title, fields, answers });
      await resend.emails.send({ from: process.env.EMAIL_FROM ?? "FormCraft <noreply@example.com>", to: recipient, ...email });
    }
  }
}

async function start() {
  console.log("Connecting to database...");
  await connectToDatabase();
  console.log("Connecting to Redis...");
  await redisClient.connect();
  console.log("Connecting to Kafka...");
  await consumer.connect();
  await consumer.subscribe({ topic: 'form-responses', fromBeginning: true });

  console.log("Worker started, listening for messages...");
  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        if (message.value) {
          await processMessage(message.value.toString());
        }
      } catch (err) {
        console.error("Error processing message", err);
      }
    },
  });
}

start().catch(console.error);
