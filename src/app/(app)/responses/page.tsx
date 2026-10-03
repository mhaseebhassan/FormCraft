"use client";

import Link from "next/link";
import useSWR from "swr";
import { ArrowRight, Download, Inbox, Search, Zap } from "lucide-react";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { timeAgo } from "@/lib/utils";
import type { FormDocumentShape } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ResponsesHubPage() {
  const { data: forms, isLoading } = useSWR<FormDocumentShape[]>("/api/forms", fetcher);
  const [search, setSearch] = useState("");

  const items = useMemo(() => {
    return (forms ?? []).filter((form) =>
      form.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [forms, search]);

  const totalSubmissions = (forms ?? []).reduce((acc, f) => acc + (f.responseCount || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <PageHeader
        eyebrow="Data Ingestion · Response Streams"
        title="Responses Center"
        description="Inspect, search, and export respondent submissions across all forms in your workspace."
        action={
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 font-mono text-xs text-neutral-300">
            <Inbox className="size-4 text-violet-400" />
            <span>{totalSubmissions} Total Submissions</span>
          </div>
        }
      />

      {/* Search Bar */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#161616] p-4 max-w-md">
        <Input
          placeholder="Search forms by title..."
          leftIcon={<Search className="size-4 text-neutral-400" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Forms Response Grid */}
      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-52 animate-pulse rounded-2xl border border-white/[0.08] bg-[#1a1a1a]" />
          ))}
        </div>
      ) : items.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((form) => (
            <SpotlightCard key={form._id} tint="violet" className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <StatusPill status={form.status} />
                  {form.lastResponseAt ? (
                    <span className="font-mono text-[10px] text-neutral-400">
                      Active {timeAgo(form.lastResponseAt)}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-4 font-heading text-lg font-bold text-neutral-100 truncate">
                  {form.title}
                </h3>
                <p className="mt-1 text-xs leading-5 text-neutral-400 line-clamp-2">
                  {form.description || "Active interactive respondent intake schema."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08]">
                <div className="flex items-baseline justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Inbox className="size-4 text-violet-400" />
                    <span className="text-xl font-bold font-mono text-neutral-100">{form.responseCount}</span>
                    <span className="text-xs text-neutral-400">entries</span>
                  </div>
                  <span className="font-mono text-[11px] text-neutral-400 flex items-center gap-1">
                    <Zap className="size-3 text-emerald-400" />
                    {form.fields.length} questions
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link href={`/forms/${form._id}/responses`} className="flex-1">
                    <Button fullWidth size="sm" rightIcon={<ArrowRight className="size-3.5" />}>
                      View Entries
                    </Button>
                  </Link>
                  <a
                    href={`/api/forms/${form._id}/responses/export`}
                    className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 text-neutral-400 transition hover:bg-white/[0.08] hover:text-white"
                    title="Export CSV"
                  >
                    <Download className="size-4" />
                  </a>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Inbox}
          title="No forms found"
          description="Create a form to start collecting and analyzing responses."
          action={{ label: "Go to Forms", onClick: () => (window.location.href = "/forms") }}
        />
      )}
    </div>
  );
}
