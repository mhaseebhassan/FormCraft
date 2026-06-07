"use client";

import type { TextareaHTMLAttributes } from "react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({ label, error, helperText, required, className, value, ...props }: TextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  }, [value]);

  return (
    <label className="block space-y-2 text-sm">
      {label ? (
        <span className="font-medium text-text-primary">
          {label} {required ? <span className="text-danger">*</span> : null}
        </span>
      ) : null}
      <textarea
        ref={ref}
        className={cn(
          "min-h-24 w-full resize-none rounded-lg border bg-[#111522] px-3 py-3 text-sm text-text-primary outline-none transition placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/30",
          error ? "border-danger" : "border-border",
          className,
        )}
        required={required}
        value={value}
        {...props}
      />
      {error ? <span className="block text-xs text-danger">{error}</span> : helperText ? <span className="block text-xs text-text-secondary">{helperText}</span> : null}
    </label>
  );
}
