"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variants = {
  primary:
    "bg-[#7c3aed] text-white hover:bg-[#6d28d9] border border-violet-400/30 shadow-[0_0_20px_rgba(124,58,237,0.25)] hover:shadow-[0_0_28px_rgba(124,58,237,0.45)]",
  secondary:
    "bg-[#161b26] text-[#f8fafc] hover:bg-[#1e2433] hover:border-violet-400/30 border border-white/10 shadow-sm",
  ghost:
    "bg-transparent text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/[0.06] border border-transparent",
  danger:
    "bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30 hover:border-red-500/50",
  outline:
    "bg-transparent text-[#f8fafc] border border-white/12 hover:border-violet-400/40 hover:bg-white/[0.04]",
};

const sizes = {
  sm: "h-9 px-3 text-xs tracking-wide",
  md: "h-10 px-4 text-sm font-medium",
  lg: "h-12 px-6 text-base font-semibold",
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  leftIcon,
  rightIcon,
  fullWidth,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
      <span>{children}</span>
      {rightIcon}
    </button>
  );
}
