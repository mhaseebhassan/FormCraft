import { NextResponse } from "next/server";
import { jsonError, requireUserId, serialize, withDatabase } from "@/lib/api";
import { Form } from "@/models/Form";
import { Response as FormResponse } from "@/models/Response";
import type { FormField, ResponseDocumentShape } from "@/types";

interface RouteContext {
  params: Promise<{ formId: string }>;
}

function median(values: number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

export async function GET(_request: Request, context: RouteContext) {
  const dbError = await withDatabase();
  if (dbError) return dbError;
  const userId = await requireUserId();
  if (!userId) return jsonError("Unauthorized", 401);
  const { formId } = await context.params;
  const form = await Form.findOne({ _id: formId, userId }).lean();
  if (!form) return jsonError("Form not found", 404);
  const fields = serialize<FormField[]>(form.fields);
  const responses = serialize<ResponseDocumentShape[]>(await FormResponse.find({ formId }).lean());

  const byDay = new Map<string, number>();
  responses.forEach((response) => {
    const day = response.createdAt.slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
  });

  const fieldAnalytics = fields
    .filter((field) => field.type !== "section_break")
    .map((field) => {
      const values = responses.map((response) => response.answers[field.id]).filter((value) => value !== undefined && value !== null && value !== "");
      if (field.type === "number" || field.type === "rating") {
        const nums = values.map(Number).filter(Number.isFinite);
        return { field, type: field.type, count: nums.length, average: nums.reduce((sum, value) => sum + value, 0) / (nums.length || 1), min: Math.min(...nums, 0), max: Math.max(...nums, 0), median: median(nums) };
      }
      const distribution = new Map<string, number>();
      values.forEach((value) => {
        const entries = Array.isArray(value) ? value : [String(value)];
        entries.forEach((entry) => distribution.set(entry, (distribution.get(entry) ?? 0) + 1));
      });
      return { field, type: field.type, count: values.length, distribution: Array.from(distribution, ([label, count]) => ({ label, count })) };
    });

  return NextResponse.json({
    overview: {
      totalResponses: responses.length,
      completionRate: responses.length ? Math.round((responses.filter((item) => item.isComplete).length / responses.length) * 100) : 0,
      averageTimeToComplete: Math.round(responses.reduce((sum, item) => sum + (item.metadata.timeToCompleteSeconds ?? 0), 0) / (responses.length || 1)),
      responsesToday: responses.filter((item) => item.createdAt.slice(0, 10) === new Date().toISOString().slice(0, 10)).length,
    },
    responsesOverTime: Array.from(byDay, ([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date)),
    fields: fieldAnalytics,
  });
}
