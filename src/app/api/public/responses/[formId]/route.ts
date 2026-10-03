import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { jsonError, serialize, withDatabase } from "@/lib/api";
import { responseSchema } from "@/lib/validations";
import { Form } from "@/models/Form";
import { publishFormResponse } from "@/lib/kafka";
import { demoStore } from "@/lib/demo-data";
import type { Answers, FormField } from "@/types";

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
  const { formId } = await context.params;
  const parsed = responseSchema.safeParse(await request.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid response", 422);

  // Check demoStore first
  const demoForm = demoStore.getFormById(formId);
  if (demoForm || !process.env.MONGODB_URI) {
    const targetForm = demoForm || demoStore.forms[0];
    const missing = validateRequired(targetForm.fields, parsed.data.answers);
    if (missing) return jsonError(missing, 422);

    const saved = demoStore.addResponse(targetForm._id, parsed.data.answers, parsed.data.metadata);
    return NextResponse.json(saved, { status: 202 });
  }

  const dbError = await withDatabase();
  if (dbError) {
    const fallback = demoStore.forms[0];
    const saved = demoStore.addResponse(fallback._id, parsed.data.answers, parsed.data.metadata);
    return NextResponse.json(saved, { status: 202 });
  }


  try {
    const form = await Form.findById(formId).lean();
    if (!form) {
      if (demoStore.forms[0]) {
        const saved = demoStore.addResponse(demoStore.forms[0]._id, parsed.data.answers, parsed.data.metadata);
        return NextResponse.json(saved, { status: 202 });
      }
      return jsonError("Form not found", 404);
    }
    if (form.status === "draft") return jsonError("This form is not yet available", 403);
    if (form.status === "closed") return jsonError("This form is closed and no longer accepting responses", 410);

    const fields = serialize<FormField[]>(form.fields);
    const answers = parsed.data.answers;
    const missing = validateRequired(fields, answers);
    if (missing) return jsonError(missing, 422);

    const now = new Date();
    const startedAt = parsed.data.metadata?.startedAt ? new Date(parsed.data.metadata.startedAt) : now;
    const responseId = new mongoose.Types.ObjectId();

    const payload = {
      _id: responseId,
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
      createdAt: now,
    };

    // Try Kafka, fallback to direct DB write if Kafka broker isn't present
    const published = await publishFormResponse(formId, payload);
    if (!published) {
      try {
        const { Response: FormResponse } = await import("@/models/Response");
        await FormResponse.create(payload);
        await Form.findByIdAndUpdate(formId, {
          $inc: { responseCount: 1 },
          $set: { lastResponseAt: now },
        });
      } catch (insertErr) {
        console.warn("Direct DB write failed, recording in demoStore:", insertErr);
        demoStore.addResponse(formId, answers, parsed.data.metadata);
      }
    }

    return NextResponse.json(serialize(payload), { status: 202 });
  } catch (err) {
    console.warn("Public response handler exception, using demoStore fallback:", err);
    const saved = demoStore.addResponse(formId, parsed.data.answers, parsed.data.metadata);
    return NextResponse.json(saved, { status: 202 });
  }
}

