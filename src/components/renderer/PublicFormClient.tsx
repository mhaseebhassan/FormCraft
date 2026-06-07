"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import type { Answers, FormDocumentShape, FormField } from "@/types";

function emptyAnswer(field: FormField) {
  return field.type === "checkboxes" ? [] : "";
}

function formatAnswer(value: Answers[string]) {
  if (Array.isArray(value)) return value.join(", ");
  return value === null || value === undefined ? "" : String(value);
}

function FieldInput({ field, value, onChange, error }: { field: FormField; value: Answers[string]; onChange: (value: Answers[string]) => void; error?: string }) {
  if (field.type === "section_break") return <div className="border-t pt-6"><h2 className="text-xl font-bold">{field.settings.sectionTitle || field.label}</h2><p className="mt-2 opacity-70">{field.settings.sectionDescription}</p></div>;
  if (field.type === "long_text") return <Textarea label={field.label} required={field.required} helperText={field.helperText} error={error} placeholder={field.placeholder} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} />;
  if (field.type === "multiple_choice") return <div><p className="mb-2 font-semibold">{field.label} {field.required ? "*" : ""}</p><div className="space-y-2">{field.options.map((option) => <label key={option} className="flex min-h-11 items-center gap-2 rounded border p-3"><input type="radio" checked={value === option} onChange={() => onChange(option)} />{option}</label>)}</div>{error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}</div>;
  if (field.type === "checkboxes") return <div><p className="mb-2 font-semibold">{field.label} {field.required ? "*" : ""}</p><div className="space-y-2">{field.options.map((option) => { const values = Array.isArray(value) ? value : []; return <label key={option} className="flex min-h-11 items-center gap-2 rounded border p-3"><input type="checkbox" checked={values.includes(option)} onChange={(event) => onChange(event.target.checked ? [...values, option] : values.filter((item) => item !== option))} />{option}</label>; })}</div>{error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}</div>;
  if (field.type === "dropdown") return <label className="block"><span className="mb-2 block font-semibold">{field.label}</span><select className="min-h-11 w-full rounded border px-3" value={String(value ?? "")} onChange={(event) => onChange(event.target.value)}><option value="">Select</option>{field.options.map((option) => <option key={option}>{option}</option>)}</select>{error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}</label>;
  if (field.type === "rating") return <div><p className="mb-2 font-semibold">{field.label}</p><div className="flex gap-2">{Array.from({ length: field.settings.maxRating ?? 5 }).map((_, index) => <button key={index} type="button" className={`text-3xl ${Number(value) >= index + 1 ? "text-amber-400" : "text-slate-300"}`} onClick={() => onChange(index + 1)}>★</button>)}</div>{error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}</div>;
  if (field.type === "file_upload") return <Input label={field.label} type="file" required={field.required} helperText={`Max ${field.settings.maxFileSizeMB ?? 5}MB`} error={error} onChange={(event) => onChange(event.target.files?.[0]?.name ?? "")} />;
  const type = field.type === "email" ? "email" : field.type === "phone" ? "tel" : field.type === "number" ? "number" : field.type === "date" ? "date" : "text";
  return <Input label={field.label} type={type} required={field.required} helperText={field.helperText} error={error} placeholder={field.placeholder} value={String(value ?? "")} onChange={(event) => onChange(field.type === "number" ? Number(event.target.value) : event.target.value)} />;
}

export function PublicFormClient({ form }: { form: FormDocumentShape }) {
  const toast = useToast();
  const fields = useMemo(() => form.fields.filter((field) => field.type !== "section_break"), [form.fields]);
  const [answers, setAnswers] = useState<Answers>(() => Object.fromEntries(form.fields.map((field) => [field.id, emptyAnswer(field)])));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [index, setIndex] = useState(0);
  const required = fields.filter((field) => field.required);
  const completed = required.filter((field) => { const value = answers[field.id]; return value !== "" && value !== null && (!Array.isArray(value) || value.length > 0); }).length;
  const progress = required.length ? Math.round((completed / required.length) * 100) : 100;

  function validate() {
    const next: Record<string, string> = {};
    form.fields.forEach((field) => {
      const value = answers[field.id];
      if (field.required && field.type !== "section_break" && (value === "" || value === null || (Array.isArray(value) && value.length === 0))) next[field.id] = `${field.label} is required`;
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit() {
    if (!validate()) {
      toast.error("Please complete required fields");
      return;
    }
    const response = await fetch(`/api/public/responses/${form._id}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ answers, metadata: { startedAt: new Date(Date.now() - 120000).toISOString(), referrer: document.referrer } }) });
    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      toast.error(body.error ?? "Submission failed");
      return;
    }
    if (form.settings.redirectUrl) window.location.href = form.settings.redirectUrl;
    else setSubmitted(true);
  }

  const fontFamily = form.settings.theme.fontFamily === "georgia" ? "Georgia, serif" : form.settings.theme.fontFamily === "poppins" ? "Poppins, Arial, sans-serif" : "Inter, Arial, sans-serif";
  if (submitted) return <main className="grid min-h-screen place-items-center p-4" style={{ background: form.settings.theme.backgroundColor, fontFamily }}><Card className="max-w-lg bg-white text-slate-900"><CheckCircle2 className="mb-4 h-12 w-12" style={{ color: form.settings.theme.primaryColor }} /><h1 className="text-2xl font-bold">{form.settings.thankYouMessage}</h1></Card></main>;

  return (
    <main className="min-h-screen p-4 text-slate-900" style={{ background: form.settings.theme.backgroundColor, fontFamily }}>
      <div className="mx-auto max-w-3xl py-10">
        <div className="mb-6 h-2 rounded bg-slate-200"><div className="h-2 rounded" style={{ width: `${progress}%`, background: form.settings.theme.primaryColor }} /></div>
        <Card className="bg-white text-slate-900">
          <h1 className="text-3xl font-bold">{form.title}</h1>
          {form.description ? <p className="mt-2 text-slate-600">{form.description}</p> : null}
          {form.settings.displayMode === "classic" ? (
            <form className="mt-8 space-y-6" onSubmit={(event) => { event.preventDefault(); void submit(); }}>
              {form.fields.map((field) => <FieldInput key={field.id} field={field} value={answers[field.id]} error={errors[field.id]} onChange={(value) => setAnswers({ ...answers, [field.id]: value })} />)}
              <Button type="submit" style={{ background: form.settings.theme.primaryColor, borderColor: form.settings.theme.primaryColor }}>{form.settings.submitButtonLabel}</Button>
            </form>
          ) : (
            <div className="mt-8">
              <AnimatePresence mode="wait">
                <motion.div key={index} initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -80, opacity: 0 }}>
                  {index < fields.length ? <><p className="mb-4 text-sm text-slate-500">{index + 1} / {fields.length}</p><FieldInput field={fields[index]} value={answers[fields[index].id]} error={errors[fields[index].id]} onChange={(value) => setAnswers({ ...answers, [fields[index].id]: value })} /><p className="mt-4 text-sm text-slate-500">Press Enter to continue</p></> : <div><h2 className="text-xl font-bold">Review your answers</h2>{fields.map((field) => <p key={field.id} className="mt-3"><strong>{field.label}:</strong> {formatAnswer(answers[field.id])}</p>)}</div>}
                </motion.div>
              </AnimatePresence>
              <div className="mt-8 flex justify-between"><Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />} disabled={index === 0} onClick={() => setIndex(index - 1)}>Back</Button>{index < fields.length ? <Button rightIcon={<ArrowRight className="h-4 w-4" />} onClick={() => setIndex(index + 1)}>Next</Button> : <Button onClick={submit}>{form.settings.submitButtonLabel}</Button>}</div>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
