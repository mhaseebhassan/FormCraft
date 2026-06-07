import { NextResponse } from "next/server";
import { jsonError, serialize, withDatabase } from "@/lib/api";
import { confirmationEmail } from "@/lib/emails/confirmation";
import { newResponseEmail } from "@/lib/emails/newResponse";
import { getResend } from "@/lib/resend";
import { responseSchema } from "@/lib/validations";
import { Form } from "@/models/Form";
import { Notification } from "@/models/Notification";
import { Response as FormResponse } from "@/models/Response";
import type { Answers, FormField, ResponseDocumentShape } from "@/types";

interface RouteContext {
  params: Promise<{ formId: string }>;
}

function validateRequired(fields: FormField[], answers: Answers) {
  const missing = fields.find((field) => {
    if (!field.required || field.type === "section_break") return false;
    const value = answers[field.id];
    return value === null || value === "" || (Array.isArray(value) && value.length === 0);
  });
  return missing ? `${missing.label} is required` : null;
}

export async function POST(request: Request, context: RouteContext) {
  const dbError = await withDatabase();
  if (dbError) return dbError;
  const { formId } = await context.params;
  const parsed = responseSchema.safeParse(await request.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid response", 422);

  const form = await Form.findById(formId).lean();
  if (!form) return jsonError("Form not found", 404);
  if (form.status === "draft") return jsonError("This form is not yet available", 403);
  if (form.status === "closed") return jsonError("This form is closed and no longer accepting responses", 410);

  const fields = serialize<FormField[]>(form.fields);
  const answers = parsed.data.answers;
  const missing = validateRequired(fields, answers);
  if (missing) return jsonError(missing, 422);

  const now = new Date();
  const startedAt = parsed.data.metadata?.startedAt ? new Date(parsed.data.metadata.startedAt) : now;
  const response = await FormResponse.create({
    formId,
    answers,
    metadata: {
      userAgent: request.headers.get("user-agent") ?? "",
      startedAt,
      completedAt: now,
      timeToCompleteSeconds: Math.max(1, Math.round((now.getTime() - startedAt.getTime()) / 1000)),
      referrer: parsed.data.metadata?.referrer,
    },
    isComplete: true,
  });

  await Form.updateOne({ _id: formId }, { $inc: { responseCount: 1 }, $set: { lastResponseAt: now } });
  await Notification.create({
    userId: form.userId,
    type: "new_response",
    title: "New response",
    message: `You received a new response on ${form.title}`,
    formId,
  });

  const resend = getResend();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  if (resend && form.settings?.notifications?.sendNotificationToOwner) {
    const ownerEmail = form.settings.notifications.notificationEmail;
    if (ownerEmail) {
      const email = newResponseEmail({ formTitle: form.title, formId, fields, answers, appUrl });
      await resend.emails.send({ from: process.env.EMAIL_FROM ?? "FormCraft <noreply@example.com>", to: ownerEmail, ...email });
    }
  }

  if (resend && form.settings?.notifications?.sendConfirmationToRespondent) {
    const emailField = fields.find((field) => field.type === "email");
    const recipient = emailField ? answers[emailField.id] : null;
    if (typeof recipient === "string" && recipient.includes("@")) {
      const email = confirmationEmail({ formTitle: form.title, fields, answers });
      await resend.emails.send({ from: process.env.EMAIL_FROM ?? "FormCraft <noreply@example.com>", to: recipient, ...email });
    }
  }

  return NextResponse.json(serialize<ResponseDocumentShape>(response), { status: 201 });
}
