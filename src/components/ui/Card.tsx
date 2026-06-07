import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

const paddingClass = { sm: "p-3", md: "p-5", lg: "p-6" };

export function Card({ hover, padding = "md", className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-border bg-surface shadow-[0_18px_60px_rgba(0,0,0,0.18)]",
        paddingClass[padding],
        hover && "transition hover:border-primary hover:shadow-[0_0_0_1px_rgba(99,102,241,0.2),0_20px_70px_rgba(99,102,241,0.12)]",
        className,
      )}
      {...props}
    />
  );
}
