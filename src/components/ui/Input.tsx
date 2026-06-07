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

export function Input({ label, error, helperText, leftIcon, rightIcon, required, className, ...props }: InputProps) {
  return (
    <label className="block space-y-2 text-sm">
      {label ? (
        <span className="font-medium text-text-primary">
          {label} {required ? <span className="text-danger">*</span> : null}
        </span>
      ) : null}
      <span className="relative block">
        {leftIcon ? <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">{leftIcon}</span> : null}
        <input
          className={cn(
            "min-h-11 w-full rounded-lg border bg-[#111522] px-3 text-sm text-text-primary outline-none transition placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/30",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error ? "border-danger" : "border-border",
            className,
          )}
          required={required}
          {...props}
        />
        {rightIcon ? <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">{rightIcon}</span> : null}
      </span>
      {error ? <span className="block text-xs text-danger">{error}</span> : helperText ? <span className="block text-xs text-text-secondary">{helperText}</span> : null}
    </label>
  );
}
