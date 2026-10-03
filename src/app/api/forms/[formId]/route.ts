import { NextResponse } from "next/server";
import { jsonError, requireUserId, serialize, withDatabase } from "@/lib/api";
import { Form } from "@/models/Form";
import { Notification } from "@/models/Notification";
import { Response as FormResponse } from "@/models/Response";
import { demoStore } from "@/lib/demo-data";
import type { FormDocumentShape } from "@/types";

interface RouteContext {
  params: Promise<{ formId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const { formId } = await context.params;

  // Check demoStore first for demo forms or zero-env
  const demoForm = demoStore.getFormById(formId) || (!process.env.MONGODB_URI ? demoStore.forms[0] : null);
  if (demoForm && (!process.env.MONGODB_URI || userId === "demo-user-id" || demoStore.getFormById(formId))) {
    return NextResponse.json(demoForm);
  }

  const dbError = await withDatabase();
  if (dbError) {
    if (demoForm) return NextResponse.json(demoForm);
    return dbError;
  }

  try {
    const form = await Form.findOne({ _id: formId, userId }).lean();
    if (!form) {
      if (demoForm) return NextResponse.json(demoForm);
      return jsonError("Form not found", 404);
    }
    return NextResponse.json(serialize<FormDocumentShape>(form));
  } catch {
    if (demoForm) return NextResponse.json(demoForm);
    return jsonError("Form not found", 404);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const { formId } = await context.params;
  const body = (await request.json()) as Record<string, unknown>;
  const allowed = ["title", "description", "fields", "settings", "status"];
  const update = Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)));

  // If in demoStore or zero-env
  if (demoStore.getFormById(formId) || !process.env.MONGODB_URI || userId === "demo-user-id") {
    const updated = demoStore.updateForm(formId, update) || demoStore.forms[0];
    return NextResponse.json(updated);
  }

  const dbError = await withDatabase();
  if (dbError) {
    const updated = demoStore.updateForm(formId, update);
    return NextResponse.json(updated || { _id: formId, ...update });
  }

  try {
    const form = await Form.findOneAndUpdate({ _id: formId, userId }, { $set: update }, { new: true }).lean();
    if (!form) return jsonError("Form not found", 404);
    return NextResponse.json(serialize<FormDocumentShape>(form));
  } catch (err) {
    console.warn("MongoDB form update failed, updating demo store:", err);
    const updated = demoStore.updateForm(formId, update);
    return NextResponse.json(updated || { _id: formId, ...update });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const { formId } = await context.params;

  // If in demoStore or zero-env
  if (demoStore.getFormById(formId) || !process.env.MONGODB_URI || userId === "demo-user-id") {
    demoStore.deleteForm(formId);
    return new Response(null, { status: 204 });
  }

  const dbError = await withDatabase();
  if (dbError) {
    demoStore.deleteForm(formId);
    return new Response(null, { status: 204 });
  }

  try {
    const form = await Form.findOneAndDelete({ _id: formId, userId }).lean();
    if (!form) return jsonError("Form not found", 404);
    await FormResponse.deleteMany({ formId });
    await Notification.deleteMany({ formId });
    return new Response(null, { status: 204 });
  } catch (err) {
    console.warn("MongoDB form deletion failed, falling back:", err);
    demoStore.deleteForm(formId);
    return new Response(null, { status: 204 });
  }
}

