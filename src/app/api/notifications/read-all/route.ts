import { jsonError, requireUserId, withDatabase } from "@/lib/api";
import { Notification } from "@/models/Notification";

export async function POST() {
  const dbError = await withDatabase();
  if (dbError) return dbError;
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  await Notification.updateMany({ userId }, { isRead: true });
  return Response.json({ ok: true });
}
