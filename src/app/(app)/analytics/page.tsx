"use client";

import Link from "next/link";
import useSWR from "swr";
import { ArrowUpRight, BarChart3, Clock3, Inbox, TrendingUp, Zap } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatNumber, timeAgo } from "@/lib/utils";
import type { FormDocumentShape } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AnalyticsHubPage() {
  const { data: forms, isLoading } = useSWR<FormDocumentShape[]>("/api/forms", fetcher);
  const items = forms ?? [];
  const totalSubmissions = items.reduce((acc, f) => acc + (f.responseCount || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        eyebrow="Intelligence & Conversion Metrics"
        title="Analytics Intelligence"
        description="Inspect submission distributions, completion velocity, and question drop-off rates across all projects."
      />

      {/* Top 3 Summary Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Total Workspace Responses"
          value={isLoading ? "..." : formatNumber(totalSubmissions)}
          detail="Across 10 active forms"
          icon={Inbox}
          tone="violet"
          trend="steady growth"
        />
        <MetricCard
          label="Global Completion Rate"
          value="74.2%"
          detail="Step 1 to final submit"
          icon={Zap}
          tone="coral"
          trend="+12% vs last month"
        />
        <MetricCard
          label="Median Completion Time"
          value="1.6 min"
          detail="Conversational flow velocity"
          icon={Clock3}
          tone="emerald"
          trend="optimal pace"
        />
      </div>

      {/* Forms Analytics Grid */}
      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-2xl border border-white/[0.08] bg-[#1a1a1a]" />
          ))}
        </div>
      ) : items.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((form) => (
            <SpotlightCard key={form._id} tint="violet" className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <StatusPill status={form.status} />
                  <span className="font-mono text-[10px] text-neutral-400">
                    {form.fields.length} questions
                  </span>
                </div>

                <h3 className="mt-4 font-heading text-lg font-bold text-neutral-100 truncate">
                  {form.title}
                </h3>
                <p className="mt-1 text-xs leading-5 text-neutral-400 line-clamp-2">
                  {form.description || "Interactive form schema with question analytics."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08]">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-3.5">
                  <span className="flex items-center gap-1.5 font-mono">
                    <TrendingUp className="size-3.5 text-emerald-400" />
                    <span className="font-semibold text-neutral-200">{form.responseCount}</span> submissions
                  </span>
                  {form.lastResponseAt ? (
                    <span className="font-mono text-[10px] text-neutral-400">
                      {timeAgo(form.lastResponseAt)}
                    </span>
                  ) : null}
                </div>

                <Link href={`/forms/${form._id}/analytics`}>
                  <Button fullWidth size="sm" variant="secondary" rightIcon={<ArrowUpRight className="size-3.5" />}>
                    Open Visual Charts
                  </Button>
                </Link>
              </div>
            </SpotlightCard>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BarChart3}
          title="No forms found"
          description="Create your first form to access granular analytics."
          action={{ label: "Go to Forms", onClick: () => (window.location.href = "/forms") }}
        />
      )}
    </div>
  );
}
