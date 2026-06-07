import type { Answers, FormField } from "@/types";

interface NewResponseEmailInput {
  formTitle: string;
  formId: string;
  fields: FormField[];
  answers: Answers;
  appUrl: string;
}

function valueToString(value: Answers[string]) {
  if (Array.isArray(value)) return value.join(", ");
  return value === null || value === undefined ? "" : String(value);
}

export function newResponseEmail({ formTitle, formId, fields, answers, appUrl }: NewResponseEmailInput) {
  const rows = fields
    .filter((field) => field.type !== "section_break")
    .slice(0, 3)
    .map(
      (field) =>
        `<tr><td style="padding:8px 0;color:#475569">${field.label}</td><td style="padding:8px 0;color:#0f172a;font-weight:600">${valueToString(answers[field.id])}</td></tr>`,
    )
    .join("");

  return {
    subject: `New response on "${formTitle}"`,
    html: `<div style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:32px">
      <div style="max-width:640px;margin:auto;background:white;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
        <div style="height:8px;background:#6366F1"></div>
        <div style="padding:28px">
          <h1 style="margin:0;color:#0f172a">FormCraft</h1>
          <p style="font-size:18px;color:#334155">You received a new response on <strong>${formTitle}</strong>.</p>
          <table style="width:100%;border-collapse:collapse">${rows}</table>
          <a href="${appUrl}/forms/${formId}/responses" style="display:inline-block;margin-top:20px;background:#6366F1;color:white;text-decoration:none;padding:12px 18px;border-radius:10px">View All Responses</a>
          <p style="margin-top:28px;color:#64748b;font-size:12px">You are receiving this because notifications are enabled for this form.</p>
        </div>
      </div>
    </div>`,
  };
}
