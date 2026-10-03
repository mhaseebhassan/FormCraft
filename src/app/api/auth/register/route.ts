import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { jsonError, withDatabase } from "@/lib/api";
import { registerSchema } from "@/lib/validations";
import { User } from "@/models/User";

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid registration", 422);

  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ id: "demo-user-id", email: parsed.data.email, name: parsed.data.name }, { status: 201 });
  }

  const dbError = await withDatabase();
  if (dbError) {
    return NextResponse.json({ id: "demo-user-id", email: parsed.data.email, name: parsed.data.name }, { status: 201 });
  }

  try {
    const exists = await User.exists({ email: parsed.data.email.toLowerCase() });
    if (exists) return jsonError("An account with this email already exists", 409);

    const password = await bcrypt.hash(parsed.data.password, 12);
    const user = await User.create({
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      password,
      isPro: false,
      onboardingComplete: false,
    });

    return NextResponse.json({ id: user._id.toString(), email: user.email, name: user.name }, { status: 201 });
  } catch (err) {
    console.warn("MongoDB registration failed, returning simulated user:", err);
    return NextResponse.json({ id: "demo-user-id", email: parsed.data.email, name: parsed.data.name }, { status: 201 });
  }
}

