import { NextResponse } from "next/server";
import { jsonError, requireUserId, serialize, withDatabase } from "@/lib/api";
import { Notification } from "@/models/Notification";
import type { NotificationDocumentShape } from "@/types";

const demoNotifications: NotificationDocumentShape[] = [
  {
    _id: "notif-1",
    userId: "demo-user-id",
    type: "new_response",
    formId: "6ac132f42051c2fe65611ba7",
    title: "New Response Received",
    message: "A respondent submitted 'Product Experience Survey' with a 5/5 satisfaction score.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    _id: "notif-2",
    userId: "demo-user-id",
    type: "new_response",
    formId: "6ac132f42051c2fe65611c68",
    title: "Summit Attendee Registered",
    message: "Alex Vance completed registration for Global Tech Summit 2026.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    _id: "notif-3",
    userId: "demo-user-id",
    type: "account",
    formId: "6ac132f42051c2fe65611ba7",
    title: "Weekly Performance Digest",
    message: "Your forms achieved an average completion rate of 94.2% this week.",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];


export async function GET() {
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);

  if (!process.env.MONGODB_URI || userId === "demo-user-id") {
    return NextResponse.json(demoNotifications);
  }

  const dbError = await withDatabase();
  if (dbError) {
    return NextResponse.json(demoNotifications);
  }

  try {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(20).lean();
    if (!notifications.length) {
      return NextResponse.json(demoNotifications);
    }
    return NextResponse.json(serialize<NotificationDocumentShape[]>(notifications));
  } catch {
    return NextResponse.json(demoNotifications);
  }
}

