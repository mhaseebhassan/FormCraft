"use client";

import { useRef, type PointerEvent, type PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

const tintGradients = {
  violet: "rgba(167, 139, 250, 0.10)",
  coral: "rgba(226, 125, 97, 0.10)",
  emerald: "rgba(52, 211, 153, 0.10)",
  amber: "rgba(251, 191, 36, 0.10)",
  cyan: "rgba(56, 189, 248, 0.10)",
  ink: "rgba(255, 255, 255, 0.06)",
};

export function SpotlightCard({
  children,
  className,
  tint = "violet",
  onClick,
}: PropsWithChildren<{
  className?: string;
  tint?: "violet" | "coral" | "emerald" | "amber" | "cyan" | "ink";
  onClick?: () => void;
}>) {
  const ref = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node) return;
    const bounds = node.getBoundingClientRect();
    node.style.setProperty("--spotlight-x", `${event.clientX - bounds.left}px`);
    node.style.setProperty("--spotlight-y", `${event.clientY - bounds.top}px`);
  }

  const color = tintGradients[tint] || tintGradients.violet;

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#161616] p-6 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.7)] backdrop-blur-sm transition-all duration-200 hover:border-white/[0.16]",
        className
      )}
      data-tint={tint}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(240px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), ${color}, transparent 65%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}


