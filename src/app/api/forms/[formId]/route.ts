import { NextResponse } from "next/server";
import { jsonError, requireUserId, serialize, withDatabase } from "@/lib/api";
import { Form } from "@/models/Form";
import { Notification } from "@/models/Notification";
import { Response as FormResponse } from "@/models/Response";
import type { FormDocumentShape } from "@/types";

interface RouteContext {
  params: Promise<{ formId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const dbError = await withDatabase();
  if (dbError) return dbError;
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const { formId } = await context.params;
  const form = await Form.findOne({ _id: formId, userId }).lean();
  if (!form) return jsonError("Form not found", 404);
  return NextResponse.json(serialize<FormDocumentShape>(form));
}

export async function PUT(request: Request, context: RouteContext) {
  const dbError = await withDatabase();
  if (dbError) return dbError;
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const { formId } = await context.params;
  const body = (await request.json()) as Record<string, unknown>;
  const allowed = ["title", "description", "fields", "settings", "status"];
  const update = Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)));
  const form = await Form.findOneAndUpdate({ _id: formId, userId }, { $set: update }, { new: true }).lean();
  if (!form) return jsonError("Form not found", 404);
  return NextResponse.json(serialize<FormDocumentShape>(form));
}

export async function DELETE(_request: Request, context: RouteContext) {
  const dbError = await withDatabase();
  if (dbError) return dbError;
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const { formId } = await context.params;
  const form = await Form.findOneAndDelete({ _id: formId, userId }).lean();
  if (!form) return jsonError("Form not found", 404);
  await FormResponse.deleteMany({ formId });
  await Notification.deleteMany({ formId });
  return new Response(null, { status: 204 });
}
