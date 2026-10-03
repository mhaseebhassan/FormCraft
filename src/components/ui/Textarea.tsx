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
    ref.current.style.height = `${Math.max(88, ref.current.scrollHeight)}px`;
  }, [value]);

  return (
    <label className="block space-y-1.5 text-sm">
      {label ? (
        <span className="block text-xs font-medium uppercase tracking-wider text-[#94a3b8]">
          {label} {required ? <span className="text-red-400">*</span> : null}
        </span>
      ) : null}
      <textarea
        ref={ref}
        className={cn(
          "min-h-24 w-full rounded-lg border bg-[#10141f] px-3.5 py-2.5 text-sm text-[#f8fafc] outline-none transition placeholder:text-[#64748b] focus:border-violet-400/60 focus:bg-[#131927] focus:ring-2 focus:ring-violet-400/20 disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-red-500/60 focus:border-red-500" : "border-white/10 hover:border-white/20",
          className,
        )}
        required={required}
        value={value}
        {...props}
      />
      {error ? (
        <span className="block text-xs font-medium text-red-400">{error}</span>
      ) : helperText ? (
        <span className="block text-xs text-[#94a3b8]">{helperText}</span>
      ) : null}
    </label>
  );
}
