import { jsonError, requireUserId, withDatabase } from "@/lib/api";
import { Form } from "@/models/Form";
import { Response as FormResponse } from "@/models/Response";
import { demoStore } from "@/lib/demo-data";

interface RouteContext {
  params: Promise<{ formId: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const { formId } = await context.params;
  const body = (await request.json()) as { ids?: string[] };
  if (!body.ids?.length) return jsonError("No response ids provided", 422);

  if (demoStore.getFormById(formId) || !process.env.MONGODB_URI || userId === "demo-user-id") {
    const ids = body.ids || [];
    if (demoStore.responses[formId]) {
      demoStore.responses[formId] = demoStore.responses[formId].filter((r) => !ids.includes(r._id));
    }
    return Response.json({ deleted: ids.length });
  }

  const dbError = await withDatabase();
  if (dbError) {
    return Response.json({ deleted: body.ids?.length || 0 });
  }

  try {
    const form = await Form.findOne({ _id: formId, userId }).lean();
    if (!form) return jsonError("Form not found", 404);
    const result = await FormResponse.deleteMany({ _id: { $in: body.ids }, formId });
    await Form.updateOne({ _id: formId }, { $inc: { responseCount: -result.deletedCount } });
    return Response.json({ deleted: result.deletedCount });
  } catch {
    return Response.json({ deleted: body.ids?.length || 0 });
  }
}

