import { NextResponse } from "next/server";
import { jsonError, requireUserId, withDatabase } from "@/lib/api";

export async function POST() {
  const dbError = await withDatabase();
  if (dbError) return dbError;
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  return NextResponse.json({
    image: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(userId)}`,
  });
}
