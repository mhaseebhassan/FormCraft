import { jsonError, requireUserId, withDatabase } from "@/lib/api";
import { Notification } from "@/models/Notification";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const { id } = await context.params;

  if (!process.env.MONGODB_URI || userId === "demo-user-id") {
    return new Response(null, { status: 204 });
  }

  const dbError = await withDatabase();
  if (dbError) {
    return new Response(null, { status: 204 });
  }

  try {
    const deleted = await Notification.findOneAndDelete({ _id: id, userId }).lean();
    if (!deleted) return new Response(null, { status: 204 });
    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 204 });
  }
}

