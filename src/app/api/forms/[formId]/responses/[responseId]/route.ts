import { jsonError, requireUserId, withDatabase } from "@/lib/api";
import { Form } from "@/models/Form";
import { Response as FormResponse } from "@/models/Response";

interface RouteContext {
  params: Promise<{ formId: string; responseId: string }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  const dbError = await withDatabase();
  if (dbError) return dbError;
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const { formId, responseId } = await context.params;
  const form = await Form.findOne({ _id: formId, userId }).lean();
  if (!form) return jsonError("Form not found", 404);
  const deleted = await FormResponse.findOneAndDelete({ _id: responseId, formId }).lean();
  if (!deleted) return jsonError("Response not found", 404);
  await Form.updateOne({ _id: formId }, { $inc: { responseCount: -1 } });
  return new Response(null, { status: 204 });
}
