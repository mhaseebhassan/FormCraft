import { NextResponse } from "next/server";
import { jsonError, serialize, withDatabase } from "@/lib/api";
import { Form } from "@/models/Form";
import type { FormDocumentShape } from "@/types";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const dbError = await withDatabase();
  if (dbError) return dbError;
  const { slug } = await context.params;
  const form = await Form.findOne({ slug }).select("-__v").lean();
  if (!form) return jsonError("Form not found", 404);
  if (form.status === "draft") return jsonError("This form is not yet available", 403);
  if (form.status === "closed") return jsonError("This form is closed and no longer accepting responses", 410);
  return NextResponse.json(serialize<FormDocumentShape>(form));
}
