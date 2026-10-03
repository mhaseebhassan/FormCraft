"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  Check,
  CheckCircle2,
  ChevronDown,
  Send,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import type { Answers, FormDocumentShape, FormField, PrimitiveAnswer } from "@/types";

function emptyAnswer(field: FormField) {
  return field.type === "checkboxes" ? [] : "";
}

function formatAnswer(value: Answers[string]) {
  if (Array.isArray(value)) return value.join(", ");
  return value === null || value === undefined ? "" : String(value);
}

export function PublicFormClient({ form }: { form: FormDocumentShape }) {
  const toast = useToast();
  const fields = useMemo(
    () => form.fields.filter((field) => field.type !== "section_break"),
    [form.fields],
  );
  const [answers, setAnswers] = useState<Answers>(() =>
    Object.fromEntries(form.fields.map((field) => [field.id, emptyAnswer(field)])),
  );
  const answersRef = useRef<Answers>(answers);
  answersRef.current = answers;

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [index, setIndex] = useState(0);

  const currentField = fields[index];
  const totalQuestions = fields.length;
  const progressPercent = totalQuestions > 0 ? Math.round(((index + 1) / totalQuestions) * 100) : 100;

  function updateAnswer(fieldId: string, val: PrimitiveAnswer) {
    const updated: Answers = { ...answersRef.current, [fieldId]: val };
    answersRef.current = updated;
    setAnswers(updated);
    setErrors((prev) => {
      if (!prev[fieldId]) return prev;
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  }

  function validateAll() {
    const next: Record<string, string> = {};
    form.fields.forEach((field) => {
      const value = answersRef.current[field.id];
      if (
        field.required &&
        field.type !== "section_break" &&
        (value === "" ||
          value === null ||
          value === undefined ||
          (Array.isArray(value) && value.length === 0))
      ) {
        next[field.id] = `${field.label} is required`;
      }
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateCurrentStep(currentAnswers: Answers = answersRef.current) {
    if (index >= fields.length) return true;
    const current = fields[index];
    if (!current?.required) return true;
    const value = currentAnswers[current.id];
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      (Array.isArray(value) && value.length === 0)
    ) {
      setErrors((prev) => ({ ...prev, [current.id]: `${current.label} is required` }));
      return false;
    }
    setErrors((prev) => {
      if (!prev[current.id]) return prev;
      const next = { ...prev };
      delete next[current.id];
      return next;
    });
    return true;
  }

  function handleNext(customAnswers?: Answers) {
    const answersToCheck = customAnswers ?? answersRef.current;
    if (validateCurrentStep(answersToCheck)) {
      if (index < fields.length) {
        setIndex((prev) => prev + 1);
      }
    }
  }

  function handlePrev() {
    setIndex((prev) => Math.max(0, prev - 1));
  }

  async function submit() {
    if (!validateAll()) {
      toast.error("Please fill in required fields");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`/api/public/responses/${form._id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          answers: answersRef.current,
          metadata: {
            startedAt: new Date(Date.now() - 60000).toISOString(),
            referrer: typeof document !== "undefined" ? document.referrer : "",
          },
        }),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        toast.error(body.error ?? "Failed to submit response");
        return;
      }

      if (form.settings.redirectUrl) {
        window.location.href = form.settings.redirectUrl;
      } else {
        setSubmitted(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Handle keyboard navigation: Enter to continue, A/B/C/D hotkeys
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (form.settings.displayMode === "conversational" && !submitted) {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          if (index < fields.length) {
            handleNext();
          } else {
            void submit();
          }
          return;
        }

        // Quick single-key select for multiple choice when not typing in text boxes
        if (
          currentField?.type === "multiple_choice" &&
          document.activeElement?.tagName !== "INPUT" &&
          document.activeElement?.tagName !== "TEXTAREA"
        ) {
          const upper = e.key.toUpperCase();
          if (upper.length === 1 && upper >= "A" && upper <= "Z") {
            const optIdx = upper.charCodeAt(0) - 65;
            if (optIdx >= 0 && optIdx < currentField.options.length) {
              e.preventDefault();
              const option = currentField.options[optIdx];
              const updated: Answers = { ...answersRef.current, [currentField.id]: option };
              updateAnswer(currentField.id, option);
              setTimeout(() => handleNext(updated), 220);
            }
          }
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [form.settings.displayMode, index, fields.length, submitted, currentField]);

  // Success view
  if (submitted) {
    return (
      <main className="min-h-screen bg-[#111111] text-neutral-100 grid place-items-center p-4">
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#181818]/95 p-10 text-center shadow-2xl backdrop-blur-2xl"
        >
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_24px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {form.settings.thankYouMessage || "Thank you for your submission!"}
          </h1>
          <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
            Your response has been securely processed and recorded.
          </p>
          <div className="mt-8 border-t border-white/[0.08] pt-6 flex justify-center items-center gap-2">
            <span className="font-mono text-xs text-neutral-400">Powered by</span>
            <span className="font-bold text-xs text-white">FormCraft</span>
          </div>
        </motion.div>
      </main>
    );
  }

  // ================= CONVERSATIONAL MODE =================
  if (form.settings.displayMode === "conversational") {
    return (
      <div className="min-h-screen bg-[#111111] text-neutral-100 overflow-hidden flex flex-col justify-between antialiased selection:bg-violet-500/30">
        {/* Top Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-white/5">
          <motion.div
            className="h-full bg-violet-500 shadow-[0_0_16px_rgba(139,92,246,0.7)]"
            animate={{ width: `${index < fields.length ? progressPercent : 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Top Status */}
        <header className="fixed top-4 left-0 w-full px-6 md:px-12 flex justify-between items-center z-40 pointer-events-none">
          <div className="flex items-center gap-2.5 pointer-events-auto">
            <span className="grid size-7 place-items-center rounded-xl bg-violet-600 text-white font-bold text-xs shadow-md">
              F
            </span>
            <span className="text-xs font-semibold text-white tracking-tight">{form.title}</span>
          </div>
          <span className="font-mono text-xs text-violet-400 font-medium tracking-wider">
            {index < fields.length ? `${index + 1} / ${fields.length}` : "Completed"}
          </span>
        </header>

        {/* Main Interactive Stage */}
        <main className="relative flex-1 flex flex-col items-center justify-center px-6 md:px-12 max-w-3xl mx-auto w-full py-20">
          <AnimatePresence mode="wait">
            {index < fields.length && currentField ? (
              <motion.div
                key={currentField.id}
                initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -28, filter: "blur(8px)" }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="w-full space-y-8"
              >
                {/* Step Marker */}
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-secondary px-3 py-1 bg-secondary/10 rounded-full border border-secondary/25">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
                    {currentField.type.replace("_", " ")}
                  </span>
                </div>

                {/* Big Display Question Headline */}
                <h1 className="font-headline-lg text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.15]">
                  {currentField.label} {currentField.required ? <span className="text-red-400">*</span> : null}
                </h1>

                {currentField.helperText ? (
                  <p className="text-sm md:text-base text-text-muted leading-relaxed">
                    {currentField.helperText}
                  </p>
                ) : null}

                {/* Input Fields Tailored for Conversational Flow */}
                <div className="pt-2">
                  {["short_text", "email", "phone", "number", "date"].includes(currentField.type) ? (
                    <div className="relative group">
                      <input
                        autoFocus
                        type={
                          currentField.type === "email"
                            ? "email"
                            : currentField.type === "number"
                            ? "number"
                            : currentField.type === "date"
                            ? "date"
                            : "text"
                        }
                        placeholder={currentField.placeholder || "Type your answer here..."}
                        value={String(answers[currentField.id] ?? "")}
                        onChange={(e) => {
                          const val =
                            currentField.type === "number"
                              ? Number(e.target.value)
                              : e.target.value;
                          updateAnswer(currentField.id, val);
                        }}
                        className="w-full bg-transparent border-0 border-b-2 border-white/15 py-4 text-xl sm:text-3xl font-headline-lg text-white outline-none focus:border-primary-container transition-all placeholder:text-[#64748b]/40"
                      />
                      <div className="absolute bottom-0 left-0 h-0.5 bg-primary w-0 group-focus-within:w-full transition-all duration-500 shadow-[0_0_12px_rgba(124,58,237,0.5)]" />
                    </div>
                  ) : currentField.type === "long_text" ? (
                    <textarea
                      autoFocus
                      rows={4}
                      placeholder={currentField.placeholder || "Type your answer here..."}
                      value={String(answers[currentField.id] ?? "")}
                      onChange={(e) => updateAnswer(currentField.id, e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-white/[0.03] p-4 text-lg text-white outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all placeholder:text-[#64748b]/40"
                    />
                  ) : currentField.type === "multiple_choice" ? (
                    <div className="grid gap-2.5">
                      {currentField.options.map((option, optIdx) => {
                        const isSelected = answers[currentField.id] === option;
                        return (
                          <button
                            type="button"
                            key={option}
                            onClick={() => {
                              const updated: Answers = { ...answersRef.current, [currentField.id]: option };
                              updateAnswer(currentField.id, option);
                              setTimeout(() => handleNext(updated), 220);
                            }}
                            className={`flex w-full items-center justify-between rounded-xl border p-4 text-left text-sm md:text-base font-medium transition cursor-pointer ${
                              isSelected
                                ? "border-primary bg-primary-container/20 text-white shadow-[0_0_20px_rgba(124,58,237,0.25)] ring-1 ring-primary"
                                : "border-white/10 bg-white/[0.03] text-white hover:border-white/25 hover:bg-white/[0.06]"
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <span
                                className={`grid h-7 w-7 place-items-center rounded-md border font-mono text-xs ${
                                  isSelected
                                    ? "border-primary bg-primary/20 text-white font-bold"
                                    : "border-white/20 text-[#94a3b8]"
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{option}</span>
                            </div>
                            {isSelected ? <Check className="h-5 w-5 text-primary" /> : null}
                          </button>
                        );
                      })}
                    </div>
                  ) : currentField.type === "checkboxes" ? (
                    <div className="grid gap-2.5">
                      {currentField.options.map((option) => {
                        const values = Array.isArray(answers[currentField.id])
                          ? (answers[currentField.id] as string[])
                          : [];
                        const isChecked = values.includes(option);
                        return (
                          <button
                            type="button"
                            key={option}
                            onClick={() => {
                              const nextValues = isChecked
                                ? values.filter((v) => v !== option)
                                : [...values, option];
                              updateAnswer(currentField.id, nextValues);
                            }}
                            className={`flex w-full items-center justify-between rounded-xl border p-4 text-left text-sm md:text-base font-medium transition cursor-pointer ${
                              isChecked
                                ? "border-primary bg-primary-container/20 text-white shadow-[0_0_20px_rgba(124,58,237,0.25)] ring-1 ring-primary"
                                : "border-white/10 bg-white/[0.03] text-white hover:border-white/25 hover:bg-white/[0.06]"
                            }`}
                          >
                            <span>{option}</span>
                            <span
                              className={`grid h-5 w-5 place-items-center rounded border transition ${
                                isChecked
                                  ? "border-primary bg-primary-container text-white"
                                  : "border-white/20"
                              }`}
                            >
                              {isChecked ? <Check className="h-3 w-3" /> : null}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : currentField.type === "rating" ? (
                    <div className="flex gap-3 text-amber-400">
                      {Array.from({ length: currentField.settings.maxRating ?? 5 }).map(
                        (_, starIdx) => {
                          const ratingVal = starIdx + 1;
                          const active = Number(answers[currentField.id] ?? 0) >= ratingVal;
                          return (
                            <button
                              type="button"
                              key={starIdx}
                              onClick={() => {
                                const updated: Answers = { ...answersRef.current, [currentField.id]: ratingVal };
                                updateAnswer(currentField.id, ratingVal);
                                setTimeout(() => handleNext(updated), 220);
                              }}
                              className={`p-2 transition-transform hover:scale-125 cursor-pointer ${
                                active
                                  ? "text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                                  : "text-white/20 hover:text-white/40"
                              }`}
                            >
                              <Star className="h-10 w-10 fill-current" />
                            </button>
                          );
                        },
                      )}
                    </div>
                  ) : null}

                  {errors[currentField.id] ? (
                    <p className="mt-3 text-xs font-medium text-red-400">
                      {errors[currentField.id]}
                    </p>
                  ) : null}
                </div>

                {/* Keyboard Hint & Next CTA */}
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-3 text-text-muted text-xs font-mono">
                    <span className="flex items-center gap-1.5">
                      <kbd className="px-2 py-1 bg-white/10 border border-white/10 rounded text-[10px] text-white">
                        ENTER ↵
                      </kbd>
                      <span>to advance</span>
                    </span>
                  </div>

                  <Button
                    size="md"
                    onClick={() => handleNext()}
                    rightIcon={<ChevronDown className="h-4 w-4" />}
                  >
                    OK
                  </Button>
                </div>
              </motion.div>
            ) : (
              /* Review & Final Submit Stage */
              <motion.div
                key="review"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full space-y-6"
              >
                <div className="space-y-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-secondary">
                    Almost Finished
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight text-white">
                    Review your answers
                  </h2>
                  <p className="text-xs text-text-muted">
                    Take a moment to check your responses before submitting.
                  </p>
                </div>

                <div className="divide-y divide-white/[0.08] rounded-2xl border border-white/10 bg-[#0F1420]/80 p-6 backdrop-blur-xl max-h-80 overflow-y-auto">
                  {fields.map((f) => (
                    <div key={f.id} className="py-3 first:pt-0 last:pb-0">
                      <span className="text-xs font-medium text-text-muted">{f.label}</span>
                      <p className="text-sm font-semibold text-white mt-1">
                        {formatAnswer(answers[f.id]) || <em className="text-[#64748b]">No answer</em>}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4">
                  <Button variant="outline" size="sm" onClick={handlePrev}>
                    Back
                  </Button>
                  <Button
                    size="lg"
                    loading={submitting}
                    rightIcon={<Send className="h-4 w-4" />}
                    onClick={submit}
                  >
                    {form.settings.submitButtonLabel || "Submit Answers"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer & Navigation Controls */}
        <footer className="w-full py-6 px-6 md:px-12 flex justify-between items-center border-t border-white/[0.06] bg-[#080B11]/60 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase text-[#64748b]">Powered by</span>
            <span className="font-bold text-xs text-white">FormCraft</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled={index === 0}
              onClick={handlePrev}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-text-muted hover:bg-white/[0.08] hover:text-white transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="Previous question"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
            <button
              disabled={index >= fields.length}
              onClick={() => handleNext()}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-text-muted hover:bg-white/[0.08] hover:text-white transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="Next question"
            >
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>
        </footer>
      </div>
    );
  }

  // ================= CLASSIC MODE =================
  return (
    <main className="min-h-screen bg-[#080B11] text-[#F1F5F9] py-12 px-4 sm:px-6 dot-grid">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        {/* Brand Bar */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded bg-primary-container text-white text-xs font-bold shadow">
              F
            </span>
            <span className="text-xs font-semibold text-white">{form.title}</span>
          </div>
          <span className="font-mono text-xs text-secondary">{progressPercent}%</span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 shadow-[0_0_12px_rgba(76,215,246,0.6)]"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Card Form */}
        <div className="rounded-2xl border border-white/10 bg-[#0F1420]/90 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
          <div className="border-b border-white/[0.08] pb-6 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-headline-lg">
              {form.title}
            </h1>
            {form.description ? (
              <p className="mt-2 text-sm text-text-muted leading-relaxed">{form.description}</p>
            ) : null}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
            className="space-y-6"
          >
            {form.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                {field.type === "section_break" ? (
                  <div className="border-t border-white/10 pt-6">
                    <h2 className="text-lg font-bold text-white">
                      {field.settings.sectionTitle || field.label}
                    </h2>
                    {field.settings.sectionDescription ? (
                      <p className="mt-1 text-xs text-text-muted">
                        {field.settings.sectionDescription}
                      </p>
                    ) : null}
                  </div>
                ) : field.type === "multiple_choice" ? (
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-text-muted mb-2">
                      {field.label} {field.required ? <span className="text-red-400">*</span> : null}
                    </label>
                    <div className="grid gap-2">
                      {field.options.map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => updateAnswer(field.id, opt)}
                          className={`flex items-center justify-between rounded-xl border p-3.5 text-left text-sm transition cursor-pointer ${
                            answers[field.id] === opt
                              ? "border-primary bg-primary-container/20 text-white ring-1 ring-primary"
                              : "border-white/10 bg-white/[0.02] text-white hover:border-white/20"
                          }`}
                        >
                          <span>{opt}</span>
                          {answers[field.id] === opt ? <Check className="h-4 w-4 text-primary" /> : null}
                        </button>
                      ))}
                    </div>
                    {errors[field.id] ? (
                      <p className="mt-1.5 text-xs text-red-400">{errors[field.id]}</p>
                    ) : null}
                  </div>
                ) : field.type === "rating" ? (
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-text-muted mb-2">
                      {field.label} {field.required ? <span className="text-red-400">*</span> : null}
                    </label>
                    <div className="flex gap-2 text-amber-400">
                      {Array.from({ length: field.settings.maxRating ?? 5 }).map((_, starI) => {
                        const rVal = starI + 1;
                        const filled = Number(answers[field.id] ?? 0) >= rVal;
                        return (
                          <button
                            key={starI}
                            type="button"
                            onClick={() => updateAnswer(field.id, rVal)}
                            className={`p-1.5 transition-transform hover:scale-110 cursor-pointer ${
                              filled ? "text-amber-400" : "text-white/20"
                            }`}
                          >
                            <Star className="h-7 w-7 fill-current" />
                          </button>
                        );
                      })}
                    </div>
                    {errors[field.id] ? (
                      <p className="mt-1.5 text-xs text-red-400">{errors[field.id]}</p>
                    ) : null}
                  </div>
                ) : field.type === "long_text" ? (
                  <Textarea
                    label={field.label}
                    required={field.required}
                    helperText={field.helperText}
                    error={errors[field.id]}
                    placeholder={field.placeholder}
                    value={String(answers[field.id] ?? "")}
                    onChange={(e) => updateAnswer(field.id, e.target.value)}
                  />
                ) : (
                  <Input
                    label={field.label}
                    type={field.type === "email" ? "email" : field.type === "number" ? "number" : "text"}
                    required={field.required}
                    helperText={field.helperText}
                    error={errors[field.id]}
                    placeholder={field.placeholder}
                    value={String(answers[field.id] ?? "")}
                    onChange={(e) =>
                      updateAnswer(
                        field.id,
                        field.type === "number" ? Number(e.target.value) : e.target.value,
                      )
                    }
                  />
                )}
              </div>
            ))}

            <div className="pt-6 border-t border-white/[0.08]">
              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={submitting}
                rightIcon={<Send className="h-4 w-4" />}
              >
                {form.settings.submitButtonLabel || "Submit Response"}
              </Button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-[#64748b]">
          Powered by <strong className="text-white font-medium">FormCraft</strong>
        </p>
      </div>
    </main>
  );
}
