"use client";

import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, placeholder, options, className, ...props }: SelectProps) {
  return (
    <label className="block space-y-2 text-sm">
      {label ? <span className="font-medium text-text-primary">{label}</span> : null}
      <select
        className={cn(
          "min-h-11 w-full rounded-lg border bg-[#111522] px-3 text-sm text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/30",
          error ? "border-danger" : "border-border",
          className,
        )}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  );
}
