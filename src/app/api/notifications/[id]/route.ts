import { jsonError, requireUserId, withDatabase } from "@/lib/api";
import { Notification } from "@/models/Notification";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  const dbError = await withDatabase();
  if (dbError) return dbError;
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const { id } = await context.params;
  const deleted = await Notification.findOneAndDelete({ _id: id, userId }).lean();
  if (!deleted) return jsonError("Notification not found", 404);
  return new Response(null, { status: 204 });
}
