import { NextResponse } from "next/server";
import { jsonError, requireUserId, serialize, withDatabase } from "@/lib/api";
import { defaultFormSettings } from "@/lib/defaults";
import { getTemplateFields } from "@/lib/templates";
import { generateSlug } from "@/lib/utils";
import { createFormSchema } from "@/lib/validations";
import { Form } from "@/models/Form";
import { demoStore } from "@/lib/demo-data";
import type { FormDocumentShape } from "@/types";

export async function GET(request: Request) {
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  // Zero-env fallback or demo user session
  if (!process.env.MONGODB_URI || userId === "demo-user-id") {
    return NextResponse.json(demoStore.getForms(search, status));
  }

  const dbError = await withDatabase();
  if (dbError) {
    return NextResponse.json(demoStore.getForms(search, status));
  }

  try {
    const query: Record<string, unknown> = { userId };
    if (status && status !== "all") query.status = status;
    if (search) query.title = { $regex: search, $options: "i" };

    const forms = await Form.find(query).sort({ updatedAt: -1 }).lean();
    if (!forms || forms.length === 0) {
      // If user has no forms yet, return demo forms so workspace is never empty
      return NextResponse.json(demoStore.getForms(search, status));
    }
    return NextResponse.json(serialize<FormDocumentShape[]>(forms));
  } catch (err) {
    console.warn("MongoDB forms lookup failed, returning demo forms:", err);
    return NextResponse.json(demoStore.getForms(search, status));
  }
}

export async function POST(request: Request) {
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);

  const parsed = createFormSchema.safeParse(await request.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid form", 422);

  // Zero-env fallback or demo user session
  if (!process.env.MONGODB_URI || userId === "demo-user-id") {
    const newForm = demoStore.addForm(parsed.data.title, parsed.data.templateId);
    return NextResponse.json(newForm, { status: 201 });
  }

  const dbError = await withDatabase();
  if (dbError) {
    const newForm = demoStore.addForm(parsed.data.title, parsed.data.templateId);
    return NextResponse.json(newForm, { status: 201 });
  }

  try {
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
  } catch (err) {
    console.warn("MongoDB form creation failed, using demoStore fallback:", err);
    const newForm = demoStore.addForm(parsed.data.title, parsed.data.templateId);
    return NextResponse.json(newForm, { status: 201 });
  }
}

