import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "neutral" | "primary" | "cyan";
  size?: "sm" | "md";
}

const variants = {
  success: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
  warning: "bg-amber-500/10 text-amber-300 border-amber-500/25",
  danger: "bg-red-500/10 text-red-300 border-red-500/25",
  neutral: "bg-white/[0.04] text-[#94a3b8] border-white/10",
  primary: "bg-violet-500/15 text-violet-200 border-violet-500/30",
  cyan: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
};

export function Badge({ variant = "neutral", size = "sm", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-mono font-medium uppercase tracking-wider",
        variants[variant],
        size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
        className,
      )}
      {...props}
    />
  );
}
