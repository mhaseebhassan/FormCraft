import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
}

const paddingClass = {
  none: "p-0",
  sm: "p-4",
  md: "p-5 md:p-6",
  lg: "p-6 md:p-8",
};

export function Card({ hover, padding = "md", className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-white/[0.08] bg-[#0f1420]/80 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.35)] shadow-inner-[0_1px_0_rgba(255,255,255,0.06)]",
        paddingClass[padding],
        hover &&
          "transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-[#121826]/90 hover:shadow-[0_12px_36px_rgba(0,0,0,0.5),0_0_24px_rgba(124,58,237,0.1)]",
        className,
      )}
      {...props}
    />
  );
}
