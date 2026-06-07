import type { Answers, FormField } from "@/types";

interface ConfirmationEmailInput {
  formTitle: string;
  fields: FormField[];
  answers: Answers;
}

function valueToString(value: Answers[string]) {
  if (Array.isArray(value)) return value.join(", ");
  return value === null || value === undefined ? "" : String(value);
}

export function confirmationEmail({ formTitle, fields, answers }: ConfirmationEmailInput) {
  const rows = fields
    .filter((field) => field.type !== "section_break")
    .map(
      (field) =>
        `<tr><td style="padding:8px 0;color:#475569">${field.label}</td><td style="padding:8px 0;color:#0f172a;font-weight:600">${valueToString(answers[field.id])}</td></tr>`,
    )
    .join("");

  return {
    subject: "Thanks for your response!",
    html: `<div style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:32px">
      <div style="max-width:640px;margin:auto;background:white;border:1px solid #e2e8f0;border-radius:16px;padding:28px">
        <h1 style="margin:0;color:#6366F1">FormCraft</h1>
        <p style="font-size:18px;color:#334155">Thank you for filling out <strong>${formTitle}</strong>. We've received your response.</p>
        <table style="width:100%;border-collapse:collapse">${rows}</table>
        <p style="margin-top:28px;color:#64748b;font-size:12px">This confirmation was sent automatically by FormCraft.</p>
      </div>
    </div>`,
  };
}
