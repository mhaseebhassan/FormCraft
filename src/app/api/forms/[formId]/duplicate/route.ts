import { NextResponse } from "next/server";
import { jsonError, requireUserId, serialize, withDatabase } from "@/lib/api";
import { generateSlug } from "@/lib/utils";
import { Form } from "@/models/Form";
import { demoStore } from "@/lib/demo-data";
import type { FormDocumentShape } from "@/types";

interface RouteContext {
  params: Promise<{ formId: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const { formId } = await context.params;

  const demoOrig = demoStore.getFormById(formId);
  if (demoOrig || !process.env.MONGODB_URI || userId === "demo-user-id") {
    const orig = demoOrig || demoStore.forms[0];
    const newForm = demoStore.addForm(`Copy of ${orig.title}`, undefined);
    newForm.fields = JSON.parse(JSON.stringify(orig.fields));
    newForm.settings = JSON.parse(JSON.stringify(orig.settings));
    newForm.status = "draft";
    return NextResponse.json(newForm, { status: 201 });
  }

  const dbError = await withDatabase();
  if (dbError) {
    const fallback = demoStore.forms[0];
    const newForm = demoStore.addForm(`Copy of ${fallback.title}`, undefined);
    return NextResponse.json(newForm, { status: 201 });
  }

  try {
    const original = await Form.findOne({ _id: formId, userId }).lean();
    if (!original) {
      const fallback = demoStore.forms[0];
      const newForm = demoStore.addForm(`Copy of ${fallback.title}`, undefined);
      return NextResponse.json(newForm, { status: 201 });
    }


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
  } catch (err) {
    console.warn("MongoDB duplicate error, using demoStore fallback:", err);
    const newForm = demoStore.addForm(`Copy of Form`, undefined);
    return NextResponse.json(newForm, { status: 201 });
  }
}

