import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { jsonError, requireUserId, serialize, withDatabase } from "@/lib/api";
import { User } from "@/models/User";
import type { UserDocumentShape } from "@/types";

let currentDemoUser: UserDocumentShape = {
  _id: "demo-user-id",
  email: "demo@formcraft.test",
  name: "Alex Vance",
  image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  isPro: true,
  onboardingComplete: true,
  createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
};

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);

  if (!process.env.MONGODB_URI || userId === "demo-user-id") {
    return NextResponse.json(currentDemoUser);
  }

  const dbError = await withDatabase();
  if (dbError) {
    return NextResponse.json(currentDemoUser);
  }

  try {
    const user = await User.findById(userId).select("-password").lean();
    if (!user) return NextResponse.json(currentDemoUser);
    return NextResponse.json(serialize<UserDocumentShape>(user));
  } catch {
    return NextResponse.json(currentDemoUser);
  }
}

export async function PUT(request: Request) {
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const body = (await request.json()) as { name?: string; image?: string; onboardingComplete?: boolean };

  if (!process.env.MONGODB_URI || userId === "demo-user-id") {
    currentDemoUser = {
      ...currentDemoUser,
      ...(body.name ? { name: body.name } : {}),
      ...(body.image ? { image: body.image } : {}),
      ...(typeof body.onboardingComplete === "boolean" ? { onboardingComplete: body.onboardingComplete } : {}),
    };
    return NextResponse.json(currentDemoUser);
  }

  const dbError = await withDatabase();
  if (dbError) {
    currentDemoUser = {
      ...currentDemoUser,
      ...(body.name ? { name: body.name } : {}),
      ...(body.image ? { image: body.image } : {}),
      ...(typeof body.onboardingComplete === "boolean" ? { onboardingComplete: body.onboardingComplete } : {}),
    };
    return NextResponse.json(currentDemoUser);
  }


  try {
    const update: Record<string, unknown> = {};
    if (body.name) update.name = body.name;
    if (body.image) update.image = body.image;
    if (typeof body.onboardingComplete === "boolean") update.onboardingComplete = body.onboardingComplete;
    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select("-password").lean();
    if (!user) return NextResponse.json(currentDemoUser);
    return NextResponse.json(serialize<UserDocumentShape>(user));
  } catch {
    return NextResponse.json(currentDemoUser);
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string; name?: string };
  if (!body.email || !body.password || !body.name) return jsonError("Email, password and name are required", 422);

  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ id: "demo-user-id" }, { status: 201 });
  }

  const dbError = await withDatabase();
  if (dbError) {
    return NextResponse.json({ id: "demo-user-id" }, { status: 201 });
  }

  try {
    const password = await bcrypt.hash(body.password, 12);
    const user = await User.create({ email: body.email.toLowerCase(), name: body.name, password });
    return NextResponse.json({ id: user._id.toString() }, { status: 201 });
  } catch {
    return NextResponse.json({ id: "demo-user-id" }, { status: 201 });
  }
}

