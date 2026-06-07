import { csvEscape, jsonError, requireUserId, serialize, withDatabase } from "@/lib/api";
import { Form } from "@/models/Form";
import { Response as FormResponse } from "@/models/Response";
import type { FormField, ResponseDocumentShape } from "@/types";

interface RouteContext {
  params: Promise<{ formId: string }>;
}

function answerToCell(value: ResponseDocumentShape["answers"][string]) {
  if (Array.isArray(value)) return value.join("; ");
  return value === null || value === undefined ? "" : String(value);
}

export async function GET(_request: Request, context: RouteContext) {
  const dbError = await withDatabase();
  if (dbError) return dbError;
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const { formId } = await context.params;
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
}
