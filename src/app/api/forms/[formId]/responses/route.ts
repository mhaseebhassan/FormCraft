import { NextResponse } from "next/server";
import { jsonError, requireUserId, serialize, withDatabase } from "@/lib/api";
import { Form } from "@/models/Form";
import { Response as FormResponse } from "@/models/Response";
import { demoStore } from "@/lib/demo-data";
import type { ResponseDocumentShape } from "@/types";

interface RouteContext {
  params: Promise<{ formId: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const { formId } = await context.params;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 25)));
  const search = searchParams.get("search")?.toLowerCase();

  // If zero-env, demo user, or demo form exists in demoStore
  if (!process.env.MONGODB_URI || userId === "demo-user-id" || demoStore.getFormById(formId)) {
    const list = demoStore.getResponses(formId, search);
    const start = (page - 1) * limit;
    return NextResponse.json({
      responses: list.slice(start, start + limit),
      total: list.length,
      page,
      limit,
    });
  }

  const dbError = await withDatabase();
  if (dbError) {
    const list = demoStore.getResponses(formId, search);
    const start = (page - 1) * limit;
    return NextResponse.json({
      responses: list.slice(start, start + limit),
      total: list.length,
      page,
      limit,
    });
  }

  try {
    const form = await Form.findOne({ _id: formId, userId }).lean();
    if (!form) return jsonError("Form not found", 404);

    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const query: Record<string, unknown> = { formId };
    if (dateFrom || dateTo) {
      query.createdAt = {
        ...(dateFrom ? { $gte: new Date(dateFrom) } : {}),
        ...(dateTo ? { $lte: new Date(dateTo) } : {}),
      };
    }

    const all = serialize<ResponseDocumentShape[]>(await FormResponse.find(query).sort({ createdAt: -1 }).lean());
    const filtered = search
      ? all.filter((response) => Object.values(response.answers).join(" ").toLowerCase().includes(search))
      : all;
    const start = (page - 1) * limit;
    return NextResponse.json({
      responses: filtered.slice(start, start + limit),
      total: filtered.length,
      page,
      limit,
    });
  } catch (err) {
    console.warn("MongoDB responses fetch failed, returning demo responses:", err);
    const list = demoStore.getResponses(formId, search);
    const start = (page - 1) * limit;
    return NextResponse.json({
      responses: list.slice(start, start + limit),
      total: list.length,
      page,
      limit,
    });
  }
}

