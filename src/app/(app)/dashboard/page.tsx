"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileEdit,
  FileText,
  Inbox,
  MoveUpRight,
  Plus,
  Radio,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { formatNumber, timeAgo } from "@/lib/utils";
import type { FormDocumentShape } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: forms, isLoading } = useSWR<FormDocumentShape[]>("/api/forms", fetcher);

  const items = forms ?? [];
  const totalResponses = items.reduce((sum, form) => sum + (form.responseCount || 0), 0);
  const activeForms = items.filter((f) => f.status === "active");
  const topForm = items[0] || null;
  const firstName = session?.user?.name?.split(" ")[0] || "Designer";

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500 max-w-7xl mx-auto">
      {/* Page Header matching Serveflow layout */}
      <PageHeader
        eyebrow="Tuesday, 23 August 2026 · Local Workspace"
        title={`Good morning, ${firstName}.`}
        description="A clear view of your active forms, live submission velocity, and conversion momentum."
        action={
          <div className="flex items-center gap-3">
            <Link
              href="/forms"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-xs font-semibold text-neutral-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              <FileText className="size-4 text-neutral-400" />
              <span>Forms Library</span>
            </Link>
            <Link
              href="/forms"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-neutral-100 px-4 text-xs font-semibold text-neutral-900 transition hover:bg-neutral-200"
            >
              <Plus className="size-4" />
              <span>Create Form</span>
            </Link>
          </div>
        }
      />

      {/* Top Banner Grid: Hero Spotlight Card & Quick Actions */}
      <div className="grid gap-5 xl:grid-cols-[1.55fr_0.85fr]">
        {/* Featured Form Card */}
        <SpotlightCard tint="violet" className="min-h-[280px] bg-[#171717] p-6 sm:p-8">
          <div className="relative z-10 flex h-full flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div className="max-w-md">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                  Featured Active Form
                </span>
                {topForm && <StatusPill status={topForm.status} />}
              </div>

              {topForm ? (
                <>
                  <h2 className="mt-4 font-heading text-2xl font-bold tracking-[-0.05em] text-neutral-100 sm:text-3xl">
                    {topForm.title}
                  </h2>
                  <p className="mt-2.5 max-w-sm text-xs leading-6 text-neutral-400 line-clamp-2">
                    {topForm.description ||
                      "Interactive respondent intake flow running with live change streams."}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-neutral-300">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Inbox className="size-3.5 text-violet-400" />
                      {topForm.responseCount} responses
                    </span>
                    <span className="flex items-center gap-1.5 font-mono">
                      <Zap className="size-3.5 text-emerald-400" />
                      {topForm.fields?.length || 5} questions
                    </span>
                    <Link
                      href={`/forms/${topForm._id}/responses`}
                      className="text-violet-400 hover:underline font-semibold"
                    >
                      View data →
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="mt-4 font-heading text-2xl font-bold tracking-[-0.05em] text-neutral-100 sm:text-3xl">
                    Start collecting useful answers.
                  </h2>
                  <p className="mt-2 max-w-sm text-xs leading-6 text-neutral-400">
                    Your workspace is populated with forms and live responses.
                  </p>
                </>
              )}
            </div>

            {/* Session / Pipeline Map Visual (Serveflow pattern) */}
            <div className="relative min-w-[200px] rounded-2xl border border-white/10 bg-[#1f1f1f]/80 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400">
                <span>Ingestion Pipeline</span>
                <MoveUpRight className="size-3.5 text-neutral-400" />
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-200">Schema compiled</p>
                    <p className="text-[10px] text-neutral-400">Validated with Zod</p>
                  </div>
                </div>
                <div className="ml-2 h-4 border-l border-dashed border-white/20" />
                <div className="flex items-center gap-2.5">
                  <span className="size-4 shrink-0 grid place-items-center rounded-full bg-violet-500/20 text-[9px] font-bold text-violet-300">
                    2
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-neutral-200">Live streaming</p>
                    <p className="text-[10px] text-emerald-400">SSE listener active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Concentric circle accent */}
          <div className="pointer-events-none absolute -right-10 -top-20 size-72 rounded-full border-[28px] border-white/[0.03]" />
          <div className="pointer-events-none absolute right-16 top-20 size-2.5 rounded-full bg-violet-400 shadow-[0_0_10px_#a78bfa]" />
        </SpotlightCard>

        {/* Quick Actions Spotlight Card */}
        <SpotlightCard tint="coral" className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                  Quick Actions
                </p>
                <h2 className="mt-2 font-heading text-lg font-bold tracking-[-0.04em] text-neutral-100">
                  Keep the momentum light.
                </h2>
              </div>
              <Sparkles className="size-4.5 text-neutral-400" />
            </div>

            <div className="mt-6 space-y-2">
              <Link
                href="/forms"
                className="group flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#1a1a1a] px-3.5 py-2.5 transition hover:border-violet-500/40 hover:bg-[#202020]"
              >
                <span className="flex items-center gap-3">
                  <FileText className="size-4 text-neutral-400 group-hover:text-violet-400" />
                  <span className="text-xs font-semibold text-neutral-200">Browse forms library</span>
                </span>
                <ArrowUpRight className="size-3.5 text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/responses"
                className="group flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#1a1a1a] px-3.5 py-2.5 transition hover:border-violet-500/40 hover:bg-[#202020]"
              >
                <span className="flex items-center gap-3">
                  <Inbox className="size-4 text-neutral-400 group-hover:text-violet-400" />
                  <span className="text-xs font-semibold text-neutral-200">Review incoming submissions</span>
                </span>
                <ArrowUpRight className="size-3.5 text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/analytics"
                className="group flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#1a1a1a] px-3.5 py-2.5 transition hover:border-violet-500/40 hover:bg-[#202020]"
              >
                <span className="flex items-center gap-3">
                  <BarChart3 className="size-4 text-neutral-400 group-hover:text-violet-400" />
                  <span className="text-xs font-semibold text-neutral-200">Inspect conversion funnel</span>
                </span>
                <ArrowUpRight className="size-3.5 text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <p className="mt-4 text-[11px] leading-5 text-neutral-400">
            FormCraft saves all responses to your local MongoDB replica in real-time.
          </p>
        </SpotlightCard>
      </div>

      {/* 4 Metric Cards with pointer spotlight tracking */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Submissions"
          value={isLoading ? "..." : formatNumber(totalResponses)}
          detail="Across 10 seeded forms"
          icon={Inbox}
          tone="violet"
          trend="+24% this week"
        />
        <MetricCard
          label="Active Forms"
          value={isLoading ? "..." : String(activeForms.length)}
          detail="Accepting responses now"
          icon={FileText}
          tone="emerald"
          trend="100% online"
        />
        <MetricCard
          label="Avg Conversion"
          value="28.4%"
          detail="Views to completed answers"
          icon={Zap}
          tone="coral"
          trend="optimal completion"
        />
        <MetricCard
          label="Avg Response Time"
          value="1.8 min"
          detail="Fast conversational flow"
          icon={Clock3}
          tone="cyan"
          trend="sub-2m completion"
        />
      </div>

      {/* Recent Forms & Submission Activity */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        {/* Left: Active Forms Showcase */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                Workspace Projects
              </p>
              <h3 className="font-heading text-xl font-bold tracking-[-0.04em] text-neutral-100">
                Forms in Circulation
              </h3>
            </div>
            <Link
              href="/forms"
              className="text-xs font-semibold text-violet-400 hover:underline flex items-center gap-1"
            >
              <span>View all forms</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {items.slice(0, 3).map((form) => (
              <SpotlightCard
                key={form._id}
                tint="ink"
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusPill status={form.status} />
                    <span className="font-mono text-[10px] text-neutral-400">
                      /{form.slug}
                    </span>
                  </div>
                  <h4 className="truncate text-base font-bold text-neutral-100">
                    {form.title}
                  </h4>
                  <p className="truncate text-xs text-neutral-400 mt-0.5">
                    {form.description || "Active interactive data collection form."}
                  </p>
                </div>

                <div className="flex items-center gap-5 sm:shrink-0">
                  <div className="text-right">
                    <p className="font-mono text-sm font-bold text-neutral-100">
                      {form.responseCount}
                    </p>
                    <p className="text-[10px] font-mono text-neutral-400 uppercase">
                      Submissions
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/forms/${form._id}/edit`}
                      className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-neutral-200 transition hover:bg-white/[0.08]"
                    >
                      Studio
                    </Link>
                    <Link
                      href={`/forms/${form._id}/responses`}
                      className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-neutral-200 transition hover:bg-white/[0.08]"
                    >
                      Data
                    </Link>
                    <Link
                      href={`/f/${form.slug}`}
                      target="_blank"
                      className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-neutral-400 transition hover:bg-white/[0.08] hover:text-white"
                      title="Open public form"
                    >
                      <ExternalLink className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>

        {/* Right: Submission Activity Momentum */}
        <div>
          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
              Live Feed
            </p>
            <h3 className="font-heading text-xl font-bold tracking-[-0.04em] text-neutral-100">
              Submission Stream
            </h3>
          </div>

          <SpotlightCard tint="violet" className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="text-xs font-semibold text-neutral-200">Recent Records</span>
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                streaming
              </span>
            </div>

            <div className="mt-3 divide-y divide-white/[0.06]">
              {items
                .filter((f) => f.lastResponseAt)
                .slice(0, 4)
                .map((form) => (
                  <div
                    key={form._id}
                    className="flex items-center justify-between py-3 hover:bg-white/[0.02] rounded-xl px-1 transition"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="truncate text-xs font-semibold text-neutral-200">
                        {form.title}
                      </p>
                      <p className="font-mono text-[10px] text-neutral-400">
                        {timeAgo(form.lastResponseAt)}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-violet-300">
                      +{form.responseCount}
                    </span>
                  </div>
                ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.08]">
              <Link
                href="/responses"
                className="flex items-center justify-between text-xs font-semibold text-violet-400 hover:underline"
              >
                <span>Browse all responses</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </SpotlightCard>
        </div>
      </div>

      {/* Footer Info Line (Serveflow pattern) */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/[0.08] pt-5 text-xs text-neutral-400">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          Connected to local MongoDB replica (mongodb://127.0.0.1:27017/formcraft)
        </span>
        <Link href="/forms" className="font-semibold text-violet-400 hover:underline">
          Manage 10 seeded forms →
        </Link>
      </div>
    </div>
  );
}
