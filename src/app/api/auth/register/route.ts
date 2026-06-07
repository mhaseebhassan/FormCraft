import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { jsonError, withDatabase } from "@/lib/api";
import { registerSchema } from "@/lib/validations";
import { User } from "@/models/User";

export async function POST(request: Request) {
  const dbError = await withDatabase();
  if (dbError) return dbError;

  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid registration", 422);

  const exists = await User.exists({ email: parsed.data.email.toLowerCase() });
  if (exists) return jsonError("An account with this email already exists", 409);

  const password = await bcrypt.hash(parsed.data.password, 12);
  const user = await User.create({
    name: parsed.data.name,
    email: parsed.data.email.toLowerCase(),
    password,
  });

  return NextResponse.json({ id: user._id.toString(), email: user.email, name: user.name }, { status: 201 });
}
