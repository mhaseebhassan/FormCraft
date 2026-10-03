import { csvEscape, jsonError, requireUserId, serialize, withDatabase } from "@/lib/api";
import { Form } from "@/models/Form";
import { Response as FormResponse } from "@/models/Response";
import { demoStore } from "@/lib/demo-data";
import type { FormField, ResponseDocumentShape } from "@/types";

interface RouteContext {
  params: Promise<{ formId: string }>;
}

function answerToCell(value: ResponseDocumentShape["answers"][string]) {
  if (Array.isArray(value)) return value.join("; ");
  return value === null || value === undefined ? "" : String(value);
}

export async function GET(_request: Request, context: RouteContext) {
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const { formId } = await context.params;

  const demoForm = demoStore.getFormById(formId);
  if (demoForm || !process.env.MONGODB_URI || userId === "demo-user-id") {
    const target = demoForm || demoStore.forms[0];
    const fields = target.fields.filter((field) => field.type !== "section_break");
    const responses = demoStore.getResponses(target._id);
    const header = ["Submitted At", ...fields.map((field) => field.label)].map(csvEscape).join(",");
    const rows = responses.map((response) =>
      [response.createdAt, ...fields.map((field) => answerToCell(response.answers[field.id]))].map(csvEscape).join(","),
    );
    return new Response([header, ...rows].join("\n"), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="${target.slug}-responses.csv"`,
      },
    });
  }

  const dbError = await withDatabase();
  if (dbError) {
    const fallback = demoStore.forms[0];
    const fields = fallback.fields.filter((field) => field.type !== "section_break");
    const responses = demoStore.getResponses(fallback._id);
    const header = ["Submitted At", ...fields.map((field) => field.label)].map(csvEscape).join(",");
    const rows = responses.map((response) =>
      [response.createdAt, ...fields.map((field) => answerToCell(response.answers[field.id]))].map(csvEscape).join(","),
    );
    return new Response([header, ...rows].join("\n"), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="${fallback.slug}-responses.csv"`,
      },
    });
  }


  try {
    const form = await Form.findOne({ _id: formId, userId }).lean();
    if (!form) return jsonError("Form not found", 404);
    const fields = serialize<FormField[]>(form.fields).filter((field) => field.type !== "section_break");
    const responses = serialize<ResponseDocumentShape[]>(await FormResponse.find({ formId }).sort({ createdAt: -1 }).lean());
    const header = ["Submitted At", ...fields.map((field) => field.label)].map(csvEscape).join(",");
    const rows = responses.map((response) =>
      [response.createdAt, ...fields.map((field) => answerToCell(response.answers[field.id]))].map(csvEscape).join(","),
    );
    return new Response([header, ...rows].join("\n"), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="${form.slug}-responses.csv"`,
      },
    });
  } catch (err) {
    console.warn("MongoDB export error, using demoStore fallback:", err);
    const target = demoStore.forms[0];
    const fields = target.fields.filter((field) => field.type !== "section_break");
    const responses = demoStore.getResponses(target._id);
    const header = ["Submitted At", ...fields.map((field) => field.label)].map(csvEscape).join(",");
    const rows = responses.map((response) =>
      [response.createdAt, ...fields.map((field) => answerToCell(response.answers[field.id]))].map(csvEscape).join(","),
    );
    return new Response([header, ...rows].join("\n"), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="${target.slug}-responses.csv"`,
      },
    });
  }
}

