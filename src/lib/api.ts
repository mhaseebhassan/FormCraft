import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireUserId() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return null;
  return userId;
}

export async function withDatabase() {
  try {
    await connectToDatabase();
    return null;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database connection failed";
    return jsonError(message, 500);
  }
}

export function serialize<T>(value: unknown): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}
