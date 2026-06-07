"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDuration } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((response) => response.json());
const colors = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"];

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
  overview: { totalResponses: number; completionRate: number; averageTimeToComplete: number; responsesToday: number };
  responsesOverTime: { date: string; count: number }[];
  fields: AnalyticsField[];
}

export default function AnalyticsPage() {
  const params = useParams<{ formId: string }>();
  const { data, isLoading } = useSWR<AnalyticsData>(`/api/forms/${params.formId}/analytics`, fetcher);
  if (isLoading || !data) return <Skeleton height="480px" />;
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-white">Analytics</h2><p className="text-sm text-text-secondary">Per-question response breakdowns.</p></div>
      <div className="grid gap-4 md:grid-cols-4">{[
        ["Total Responses", data.overview.totalResponses],
        ["Completion Rate", `${data.overview.completionRate}%`],
        ["Average Time", formatDuration(data.overview.averageTimeToComplete)],
        ["Responses Today", data.overview.responsesToday],
      ].map(([label, value]) => <Card key={label}><p className="text-sm text-text-secondary">{label}</p><p className="mt-2 text-2xl font-bold text-white">{value}</p></Card>)}</div>
      <Card><h3 className="mb-4 font-semibold text-white">Responses over time</h3><div className="h-72"><ResponsiveContainer><LineChart data={data.responsesOverTime}><CartesianGrid stroke="#2A2D3E" /><XAxis dataKey="date" stroke="#94A3B8" /><YAxis stroke="#94A3B8" /><Tooltip contentStyle={{ background: "#1A1D2E", border: "1px solid #2A2D3E" }} /><Line dataKey="count" stroke="#6366F1" strokeWidth={2} /></LineChart></ResponsiveContainer></div></Card>
      <div className="grid gap-4 lg:grid-cols-2">{data.fields.map((field) => <Card key={field.field.id}><h3 className="mb-4 font-semibold text-white">{field.field.label}</h3>{field.distribution ? <><div className="h-64"><ResponsiveContainer>{["multiple_choice", "dropdown"].includes(field.type) ? <PieChart><Pie data={field.distribution} dataKey="count" nameKey="label">{field.distribution.map((item, index) => <Cell key={item.label} fill={colors[index % colors.length]} />)}</Pie><Tooltip /></PieChart> : <BarChart data={field.distribution}><CartesianGrid stroke="#2A2D3E" /><XAxis dataKey="label" stroke="#94A3B8" /><YAxis stroke="#94A3B8" /><Tooltip /><Bar dataKey="count" fill="#6366F1" /></BarChart>}</ResponsiveContainer></div><table className="mt-4 w-full text-sm"><tbody>{field.distribution.map((item) => <tr key={item.label} className="border-t border-border"><td className="py-2 text-text-secondary">{item.label}</td><td className="py-2 text-right text-white">{item.count}</td></tr>)}</tbody></table></> : <div className="grid grid-cols-2 gap-3"><Card padding="sm"><p className="text-sm text-text-secondary">Average</p><p className="text-xl font-bold">{field.average?.toFixed(1)}</p></Card><Card padding="sm"><p className="text-sm text-text-secondary">Median</p><p className="text-xl font-bold">{field.median}</p></Card><Card padding="sm"><p className="text-sm text-text-secondary">Min</p><p className="text-xl font-bold">{field.min}</p></Card><Card padding="sm"><p className="text-sm text-text-secondary">Max</p><p className="text-xl font-bold">{field.max}</p></Card></div>}</Card>)}</div>
    </div>
  );
}
