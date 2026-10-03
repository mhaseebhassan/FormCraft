import { NextResponse } from "next/server";
import { jsonError, requireUserId, serialize, withDatabase } from "@/lib/api";
import { Notification } from "@/models/Notification";
import type { NotificationDocumentShape } from "@/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(_request: Request, context: RouteContext) {
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const { id } = await context.params;

  if (!process.env.MONGODB_URI || userId === "demo-user-id") {
    return NextResponse.json({ _id: id, userId, read: true, isRead: true });
  }

  const dbError = await withDatabase();
  if (dbError) {
    return NextResponse.json({ _id: id, userId, read: true, isRead: true });
  }

  try {
    const notification = await Notification.findOneAndUpdate({ _id: id, userId }, { isRead: true }, { new: true }).lean();
    if (!notification) return NextResponse.json({ _id: id, userId, read: true, isRead: true });
    return NextResponse.json(serialize<NotificationDocumentShape>(notification));
  } catch {
    return NextResponse.json({ _id: id, userId, read: true, isRead: true });
  }
}

