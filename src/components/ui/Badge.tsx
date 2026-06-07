import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "neutral" | "primary";
  size?: "sm" | "md";
}

const variants = {
  success: "bg-success/15 text-emerald-300 border-success/30",
  warning: "bg-warning/15 text-amber-300 border-warning/30",
  danger: "bg-danger/15 text-red-300 border-danger/30",
  neutral: "bg-white/5 text-text-secondary border-white/10",
  primary: "bg-primary/15 text-indigo-200 border-primary/30",
};

export function Badge({ variant = "neutral", size = "sm", className, ...props }: BadgeProps) {
  return <span className={cn("inline-flex items-center rounded-full border font-semibold", variants[variant], size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm", className)} {...props} />;
}
