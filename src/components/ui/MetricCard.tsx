"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const iconTones = {
  violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  coral: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  ink: "text-neutral-300 bg-neutral-800 border-neutral-700",
} as const;

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "violet",
  trend,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "violet" | "coral" | "emerald" | "amber" | "cyan" | "ink";
  trend?: string;
}) {
  return (
    <SpotlightCard tint={tone} className="p-5 flex flex-col justify-between">
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
            {label}
          </p>
          <p className="mt-3 font-mono text-3xl font-bold tracking-[-0.05em] text-neutral-100">
            {value}
          </p>
          <p className="mt-1 text-xs text-neutral-400">{detail}</p>
        </div>
        <div
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-xl border",
            iconTones[tone]
          )}
        >
          <Icon className="size-4.5" aria-hidden="true" />
        </div>
      </div>
      <div className="relative mt-5 flex items-center gap-1.5 text-[11px] font-medium text-neutral-400">
        <ArrowUpRight className="size-3.5 text-emerald-400" aria-hidden="true" />
        <span>{trend || "healthy activity this week"}</span>
      </div>
    </SpotlightCard>
  );
}
