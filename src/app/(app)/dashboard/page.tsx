"use client";

import Link from "next/link";
import useSWR from "swr";
import { motion } from "framer-motion";
import { BarChart2, CheckCircle2, FileText, Inbox, Plus, Zap } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatNumber, timeAgo } from "@/lib/utils";
import type { FormDocumentShape } from "@/types";

const fetcher = (url: string) => fetch(url).then((response) => response.json());

export default function DashboardPage() {
  const { data: forms, isLoading } = useSWR<FormDocumentShape[]>("/api/forms", fetcher);
  const items = forms ?? [];
  const totalResponses = items.reduce((sum, form) => sum + form.responseCount, 0);
  const stats = [
    { label: "Total Forms", value: items.length, icon: FileText },
    { label: "Total Responses", value: totalResponses, icon: Inbox },
    { label: "Active Forms", value: items.filter((form) => form.status === "active").length, icon: Zap },
    { label: "Responses This Week", value: totalResponses, icon: BarChart2 },
  ];
  const topForms = [...items].sort((a, b) => b.responseCount - a.responseCount).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-sm text-text-secondary">Monitor form performance and recent activity.</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => (window.location.href = "/forms")}>Create New Form</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {isLoading ? [0, 1, 2, 3].map((item) => <Card key={item}><Skeleton height="80px" /></Card>) : stats.map((stat) => (
          <Card key={stat.label}>
            <stat.icon className="h-5 w-5 text-primary" />
            <p className="mt-4 text-sm text-text-secondary">{stat.label}</p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 text-3xl font-bold text-white">{formatNumber(stat.value)}</motion.p>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-semibold text-white">Top Forms by responses</h3>
            <Link href="/forms" className="text-sm text-indigo-300">View all</Link>
          </div>
          {topForms.length ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topForms}>
                  <CartesianGrid stroke="#2A2D3E" vertical={false} />
                  <XAxis dataKey="title" stroke="#94A3B8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip contentStyle={{ background: "#1A1D2E", border: "1px solid #2A2D3E", color: "#F1F5F9" }} />
                  <Bar dataKey="responseCount" fill="#6366F1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <EmptyState icon={FileText} title="No forms yet" description="Create your first form to see response charts here." action={{ label: "Create form", onClick: () => (window.location.href = "/forms") }} />}
        </Card>
        <Card>
          <h3 className="font-semibold text-white">Onboarding</h3>
          <div className="mt-4 space-y-3">
            {[
              { label: "Create your first form", done: items.length > 0 },
              { label: "Share your form", done: false },
              { label: "Receive your first response", done: totalResponses > 0 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                <CheckCircle2 className={`h-5 w-5 ${item.done ? "text-success" : "text-text-secondary"}`} />
                <span className="text-sm text-text-primary">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 h-2 rounded bg-slate-700"><div className="h-2 rounded bg-primary" style={{ width: `${([items.length > 0, false, totalResponses > 0].filter(Boolean).length / 3) * 100}%` }} /></div>
        </Card>
      </div>
      <Card>
        <h3 className="mb-4 font-semibold text-white">Recent Activity</h3>
        {items.filter((form) => form.lastResponseAt).slice(0, 10).map((form) => (
          <Link key={form._id} href={`/forms/${form._id}/responses`} className="flex items-center justify-between border-t border-border py-3 first:border-t-0">
            <div><p className="font-medium text-white">{form.title}</p><p className="text-sm text-text-secondary">Latest response {timeAgo(form.lastResponseAt)}</p></div>
            <Badge variant="primary">{form.responseCount} responses</Badge>
          </Link>
        ))}
        {!items.some((form) => form.lastResponseAt) ? <p className="text-sm text-text-secondary">No response activity yet.</p> : null}
      </Card>
    </div>
  );
}
