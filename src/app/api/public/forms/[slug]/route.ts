import { NextResponse } from "next/server";
import { jsonError, serialize, withDatabase } from "@/lib/api";
import { Form } from "@/models/Form";
import { demoStore } from "@/lib/demo-data";
import type { FormDocumentShape } from "@/types";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  // Check demoStore first (supports demo slugs like sQaJUY4L, UtE8efQe, XgXbRbLO)
  const demoForm = demoStore.getFormBySlug(slug) || demoStore.getFormById(slug);
  if (demoForm) {
    return NextResponse.json(demoForm);
  }

  if (!process.env.MONGODB_URI) {
    if (demoStore.forms[0]) return NextResponse.json(demoStore.forms[0]);
    return jsonError("Form not found", 404);
  }

  const dbError = await withDatabase();
  if (dbError) {
    if (demoStore.forms[0]) return NextResponse.json(demoStore.forms[0]);
    return dbError;
  }

  try {
    const form = await Form.findOne({ slug }).select("-__v").lean();
    if (!form) {
      if (demoStore.forms[0]) return NextResponse.json(demoStore.forms[0]);
      return jsonError("Form not found", 404);
    }
    if (form.status === "draft") return jsonError("This form is not yet available", 403);
    if (form.status === "closed") return jsonError("This form is closed and no longer accepting responses", 410);
    return NextResponse.json(serialize<FormDocumentShape>(form));
  } catch {
    if (demoStore.forms[0]) return NextResponse.json(demoStore.forms[0]);
    return jsonError("Form not found", 404);
  }
}

