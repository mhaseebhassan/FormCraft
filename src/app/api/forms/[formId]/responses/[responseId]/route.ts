import { jsonError, requireUserId, withDatabase } from "@/lib/api";
import { Form } from "@/models/Form";
import { Response as FormResponse } from "@/models/Response";
import { demoStore } from "@/lib/demo-data";

interface RouteContext {
  params: Promise<{ formId: string; responseId: string }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const { formId, responseId } = await context.params;

  if (demoStore.getFormById(formId) || !process.env.MONGODB_URI || userId === "demo-user-id") {
    if (demoStore.responses[formId]) {
      demoStore.responses[formId] = demoStore.responses[formId].filter((r) => r._id !== responseId);
    }
    return new Response(null, { status: 204 });
  }

  const dbError = await withDatabase();
  if (dbError) {
    return new Response(null, { status: 204 });
  }

  try {
    const form = await Form.findOne({ _id: formId, userId }).lean();
    if (!form) return jsonError("Form not found", 404);
    const deleted = await FormResponse.findOneAndDelete({ _id: responseId, formId }).lean();
    if (!deleted) return jsonError("Response not found", 404);
    await Form.updateOne({ _id: formId }, { $inc: { responseCount: -1 } });
    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 204 });
  }
}

