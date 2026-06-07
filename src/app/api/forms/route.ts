import { NextResponse } from "next/server";
import { jsonError, requireUserId, serialize, withDatabase } from "@/lib/api";
import { defaultFormSettings } from "@/lib/defaults";
import { getTemplateFields } from "@/lib/templates";
import { generateSlug } from "@/lib/utils";
import { createFormSchema } from "@/lib/validations";
import { Form } from "@/models/Form";
import type { FormDocumentShape } from "@/types";

export async function GET(request: Request) {
  const dbError = await withDatabase();
  if (dbError) return dbError;
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const query: Record<string, unknown> = { userId };
  if (status && status !== "all") query.status = status;
  if (search) query.title = { $regex: search, $options: "i" };

  const forms = await Form.find(query).sort({ updatedAt: -1 }).lean();
  return NextResponse.json(serialize<FormDocumentShape[]>(forms));
}

export async function POST(request: Request) {
  const dbError = await withDatabase();
  if (dbError) return dbError;
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);

  const parsed = createFormSchema.safeParse(await request.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid form", 422);

  let slug = generateSlug();
  while (await Form.exists({ slug })) slug = generateSlug();

  const form = await Form.create({
    userId,
    title: parsed.data.title,
    slug,
    fields: getTemplateFields(parsed.data.templateId),
    settings: defaultFormSettings,
  });

  return NextResponse.json(serialize<FormDocumentShape>(form), { status: 201 });
}
