"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  required,
  className,
  ...props
}: InputProps) {
  return (
    <label className="block space-y-1.5 text-sm">
      {label ? (
        <span className="block text-xs font-medium uppercase tracking-wider text-[#94a3b8]">
          {label} {required ? <span className="text-red-400">*</span> : null}
        </span>
      ) : null}
      <span className="relative block">
        {leftIcon ? (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]">
            {leftIcon}
          </span>
        ) : null}
        <input
          className={cn(
            "h-10 w-full rounded-lg border bg-[#10141f] px-3.5 text-sm text-[#f8fafc] outline-none transition-all placeholder:text-[#64748b] focus:border-violet-400/60 focus:bg-[#131927] focus:ring-2 focus:ring-violet-400/20 disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error
              ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
              : "border-white/10 hover:border-white/20",
            className,
          )}
          required={required}
          {...props}
        />
        {rightIcon ? (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]">
            {rightIcon}
          </span>
        ) : null}
      </span>
      {error ? (
        <span className="block text-xs font-medium text-red-400">{error}</span>
      ) : helperText ? (
        <span className="block text-xs text-[#94a3b8]">{helperText}</span>
      ) : null}
    </label>
  );
}
