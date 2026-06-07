"use client";

import { motion } from "framer-motion";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <button type="button" disabled={disabled} onClick={() => onChange(!checked)} className="flex min-h-11 items-center gap-3 text-left text-sm text-text-primary disabled:opacity-50">
      <span className={`flex h-6 w-11 items-center rounded-full p-1 transition ${checked ? "bg-primary" : "bg-slate-700"}`}>
        <motion.span layout className="h-4 w-4 rounded-full bg-white" style={{ x: checked ? 20 : 0 }} />
      </span>
      {label ? <span>{label}</span> : null}
    </button>
  );
}
