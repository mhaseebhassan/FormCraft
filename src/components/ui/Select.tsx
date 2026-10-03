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
    <label className="block space-y-1.5 text-sm">
      {label ? (
        <span className="block text-xs font-medium uppercase tracking-wider text-[#94a3b8]">
          {label}
        </span>
      ) : null}
      <select
        className={cn(
          "h-10 w-full rounded-lg border bg-[#10141f] px-3 text-sm text-[#f8fafc] outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-red-500/60" : "border-white/10 hover:border-white/20",
          className,
        )}
        {...props}
      >
        {placeholder ? (
          <option value="" className="bg-[#10141f] text-[#64748b]">
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-[#10141f] text-[#f8fafc]">
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="block text-xs font-medium text-red-400">{error}</span> : null}
    </label>
  );
}
