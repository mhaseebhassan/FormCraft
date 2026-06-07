import { NextResponse } from "next/server";
import { jsonError, requireUserId, serialize, withDatabase } from "@/lib/api";
import { generateSlug } from "@/lib/utils";
import { Form } from "@/models/Form";
import type { FormDocumentShape } from "@/types";

interface RouteContext {
  params: Promise<{ formId: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const dbError = await withDatabase();
  if (dbError) return dbError;
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const { formId } = await context.params;
  const original = await Form.findOne({ _id: formId, userId }).lean();
  if (!original) return jsonError("Form not found", 404);

  let slug = generateSlug();
  while (await Form.exists({ slug })) slug = generateSlug();

  const duplicate = await Form.create({
    userId,
    title: `Copy of ${original.title}`,
    description: original.description,
    slug,
    status: "draft",
    fields: original.fields,
    settings: original.settings,
    responseCount: 0,
  });

  return NextResponse.json(serialize<FormDocumentShape>(duplicate), { status: 201 });
}
