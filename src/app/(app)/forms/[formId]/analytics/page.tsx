"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/ui/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDuration } from "@/lib/utils";
import { Clock3, Inbox, TrendingUp, Zap } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((response) => response.json());
const colors = ["#8b5cf6", "#10b981", "#f59e0b", "#e27d61", "#38bdf8"];

interface AnalyticsField {
  field: { id: string; label: string; type: string };
  type: string;
  count: number;
  average?: number;
  min?: number;
  max?: number;
  median?: number;
  distribution?: { label: string; count: number }[];
}

interface AnalyticsData {
  overview: {
    totalResponses: number;
    completionRate: number;
    averageTimeToComplete: number;
    responsesToday: number;
  };
  responsesOverTime: { date: string; count: number }[];
  fields: AnalyticsField[];
}

export default function AnalyticsPage() {
  const params = useParams<{ formId: string }>();
  const { data, isLoading } = useSWR<AnalyticsData>(`/api/forms/${params.formId}/analytics`, fetcher);

  if (isLoading || !data) return <Skeleton height="480px" />;

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Conversion Breakdown · Form Analytics"
        title="Form Analytics"
        description="Per-question distribution, respondent drop-off, and submission timelines."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Total Responses"
          value={String(data.overview.totalResponses)}
          detail="Recorded submissions"
          icon={Inbox}
          tone="violet"
        />
        <MetricCard
          label="Completion Rate"
          value={`${data.overview.completionRate}%`}
          detail="Optimal funnel"
          icon={Zap}
          tone="coral"
        />
        <MetricCard
          label="Average Time"
          value={formatDuration(data.overview.averageTimeToComplete)}
          detail="Time to finish"
          icon={Clock3}
          tone="emerald"
        />
        <MetricCard
          label="Responses Today"
          value={String(data.overview.responsesToday)}
          detail="Last 24 hours"
          icon={TrendingUp}
          tone="amber"
        />
      </div>

      <SpotlightCard tint="violet" className="p-6">
        <h3 className="mb-4 font-heading text-lg font-bold text-neutral-100">
          Submissions Over Time
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.responsesOverTime}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" stroke="#737373" fontSize={11} />
              <YAxis stroke="#737373" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "#171717",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Line dataKey="count" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: "#8b5cf6", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SpotlightCard>

      <div className="grid gap-6 lg:grid-cols-2">
        {data.fields.map((field) => (
          <SpotlightCard key={field.field.id} tint="ink" className="p-6">
            <div className="flex items-center justify-between mb-4 border-b border-white/[0.08] pb-3">
              <h3 className="font-heading text-base font-bold text-neutral-100 truncate pr-2">
                {field.field.label}
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                {field.type}
              </span>
            </div>

            {field.distribution ? (
              <>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    {["multiple_choice", "dropdown"].includes(field.type) ? (
                      <PieChart>
                        <Pie data={field.distribution} dataKey="count" nameKey="label" innerRadius={45} outerRadius={80}>
                          {field.distribution.map((item, index) => (
                            <Cell key={item.label} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "#171717",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                          }}
                        />
                      </PieChart>
                    ) : (
                      <BarChart data={field.distribution}>
                        <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                        <XAxis dataKey="label" stroke="#737373" fontSize={11} />
                        <YAxis stroke="#737373" fontSize={11} />
                        <Tooltip
                          contentStyle={{
                            background: "#171717",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                          }}
                        />
                        <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
                <table className="mt-4 w-full text-xs">
                  <tbody className="divide-y divide-white/[0.06]">
                    {field.distribution.map((item) => (
                      <tr key={item.label}>
                        <td className="py-2 text-neutral-400">{item.label}</td>
                        <td className="py-2 text-right font-mono font-bold text-neutral-200">
                          {item.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-center">
                  <p className="text-[10px] uppercase font-mono text-neutral-400">Average</p>
                  <p className="mt-1 text-xl font-bold font-mono text-neutral-100">
                    {field.average?.toFixed(1) ?? "N/A"}
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-center">
                  <p className="text-[10px] uppercase font-mono text-neutral-400">Median</p>
                  <p className="mt-1 text-xl font-bold font-mono text-neutral-100">
                    {field.median ?? "N/A"}
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-center">
                  <p className="text-[10px] uppercase font-mono text-neutral-400">Min</p>
                  <p className="mt-1 text-xl font-bold font-mono text-neutral-100">
                    {field.min ?? "N/A"}
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-center">
                  <p className="text-[10px] uppercase font-mono text-neutral-400">Max</p>
                  <p className="mt-1 text-xl font-bold font-mono text-neutral-100">
                    {field.max ?? "N/A"}
                  </p>
                </div>
              </div>
            )}
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}
