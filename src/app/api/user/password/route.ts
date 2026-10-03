import bcrypt from "bcryptjs";
import { jsonError, requireUserId, withDatabase } from "@/lib/api";
import { User } from "@/models/User";

export async function PUT(request: Request) {
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const body = (await request.json()) as { currentPassword?: string; newPassword?: string };
  if (!body.currentPassword || !body.newPassword) return jsonError("Current and new password are required", 422);

  if (!process.env.MONGODB_URI || userId === "demo-user-id") {
    return Response.json({ ok: true });
  }

  const dbError = await withDatabase();
  if (dbError) {
    return Response.json({ ok: true });
  }

  try {
    const user = await User.findById(userId);
    if (!user?.password) return jsonError("Password is managed by your OAuth provider", 400);
    const valid = await bcrypt.compare(body.currentPassword, user.password);
    if (!valid) return jsonError("Current password is incorrect", 401);
    user.password = await bcrypt.hash(body.newPassword, 12);
    await user.save();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: true });
  }
}

