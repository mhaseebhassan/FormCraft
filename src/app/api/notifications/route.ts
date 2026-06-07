import { NextResponse } from "next/server";
import { jsonError, requireUserId, serialize, withDatabase } from "@/lib/api";
import { Notification } from "@/models/Notification";
import type { NotificationDocumentShape } from "@/types";

export async function GET() {
  const dbError = await withDatabase();
  if (dbError) return dbError;
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(20).lean();
  return NextResponse.json(serialize<NotificationDocumentShape[]>(notifications));
}
