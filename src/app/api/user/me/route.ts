import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { jsonError, requireUserId, serialize, withDatabase } from "@/lib/api";
import { User } from "@/models/User";
import type { UserDocumentShape } from "@/types";

export async function GET() {
  const dbError = await withDatabase();
  if (dbError) return dbError;
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const user = await User.findById(userId).select("-password").lean();
  if (!user) return jsonError("User not found", 404);
  return NextResponse.json(serialize<UserDocumentShape>(user));
}

export async function PUT(request: Request) {
  const dbError = await withDatabase();
  if (dbError) return dbError;
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const body = (await request.json()) as { name?: string; image?: string; onboardingComplete?: boolean };
  const update: Record<string, unknown> = {};
  if (body.name) update.name = body.name;
  if (body.image) update.image = body.image;
  if (typeof body.onboardingComplete === "boolean") update.onboardingComplete = body.onboardingComplete;
  const user = await User.findByIdAndUpdate(userId, update, { new: true }).select("-password").lean();
  if (!user) return jsonError("User not found", 404);
  return NextResponse.json(serialize<UserDocumentShape>(user));
}

export async function POST(request: Request) {
  const dbError = await withDatabase();
  if (dbError) return dbError;
  const body = (await request.json()) as { email?: string; password?: string; name?: string };
  if (!body.email || !body.password || !body.name) return jsonError("Email, password and name are required", 422);
  const password = await bcrypt.hash(body.password, 12);
  const user = await User.create({ email: body.email.toLowerCase(), name: body.name, password });
  return NextResponse.json({ id: user._id.toString() }, { status: 201 });
}
