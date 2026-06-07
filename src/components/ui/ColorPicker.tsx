"use client";

import { Check } from "lucide-react";

const colors = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#06B6D4", "#A855F7", "#111827", "#FFFFFF"];

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {colors.map((color) => (
          <button key={color} type="button" aria-label={`Select ${color}`} onClick={() => onChange(color)} className="flex h-10 items-center justify-center rounded-lg border border-border" style={{ background: color }}>
            {value.toLowerCase() === color.toLowerCase() ? <Check className="h-4 w-4 text-white drop-shadow" /> : null}
          </button>
        ))}
      </div>
      <input type="color" value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-lg border border-border bg-surface" />
    </div>
  );
}
