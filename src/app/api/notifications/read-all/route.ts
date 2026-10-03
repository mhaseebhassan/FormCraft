import { jsonError, requireUserId, withDatabase } from "@/lib/api";
import { Notification } from "@/models/Notification";

export async function POST() {
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);

  if (!process.env.MONGODB_URI || userId === "demo-user-id") {
    return Response.json({ ok: true });
  }

  try {
    await withDatabase();
    await Notification.updateMany({ userId }, { isRead: true });
  } catch {
    // Graceful fallback
  }
  return Response.json({ ok: true });
}

