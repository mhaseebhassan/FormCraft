import { NextResponse } from "next/server";
import { jsonError, requireUserId, serialize, withDatabase } from "@/lib/api";
import { Notification } from "@/models/Notification";
import type { NotificationDocumentShape } from "@/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(_request: Request, context: RouteContext) {
  const dbError = await withDatabase();
  if (dbError) return dbError;
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const { id } = await context.params;
  const notification = await Notification.findOneAndUpdate({ _id: id, userId }, { isRead: true }, { new: true }).lean();
  if (!notification) return jsonError("Notification not found", 404);
  return NextResponse.json(serialize<NotificationDocumentShape>(notification));
}
