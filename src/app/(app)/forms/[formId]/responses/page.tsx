"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { Download, Inbox, Search, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate, formatDuration } from "@/lib/utils";
import type { FormDocumentShape, ResponseDocumentShape } from "@/types";

const fetcher = (url: string) => fetch(url).then((response) => response.json());

function formatAnswer(value: ResponseDocumentShape["answers"][string]) {
  if (Array.isArray(value)) return value.join(", ");
  return value === null || value === undefined ? "" : String(value);
}

export default function ResponsesPage() {
  const params = useParams<{ formId: string }>();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ResponseDocumentShape | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { data: form } = useSWR<FormDocumentShape>(`/api/forms/${params.formId}`, fetcher);
  const { data, isLoading, mutate } = useSWR<{ responses: ResponseDocumentShape[]; total: number }>(`/api/forms/${params.formId}/responses?search=${encodeURIComponent(search)}`, fetcher);
  const responses = data?.responses ?? [];
  const fields = useMemo(() => form?.fields.filter((field) => field.type !== "section_break") ?? [], [form]);

  async function bulkDelete() {
    await fetch(`/api/forms/${params.formId}/responses/bulk-delete`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids: checked }) });
    setChecked([]);
    setConfirmOpen(false);
    await mutate();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div><h2 className="text-2xl font-bold text-white">Responses</h2><p className="text-sm text-text-secondary">{form?.title ?? "Form"} submissions and exports.</p></div>
        <Button leftIcon={<Download className="h-4 w-4" />} onClick={() => (window.location.href = `/api/forms/${params.formId}/responses/export`)}>Export CSV</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Total Responses", data?.total ?? 0],
          ["Completion Rate", "100%"],
          ["Average Time", responses.length ? formatDuration(Math.round(responses.reduce((sum, item) => sum + item.metadata.timeToCompleteSeconds, 0) / responses.length)) : "0s"],
          ["Responses Today", responses.filter((item) => item.createdAt.slice(0, 10) === new Date().toISOString().slice(0, 10)).length],
        ].map(([label, value]) => <Card key={label}><p className="text-sm text-text-secondary">{label}</p><p className="mt-2 text-2xl font-bold text-white">{value}</p></Card>)}
      </div>
      <Card>
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <Input placeholder="Search answers" leftIcon={<Search className="h-4 w-4" />} value={search} onChange={(event) => setSearch(event.target.value)} />
          <Input type="date" />
          <Input type="date" />
        </div>
        {checked.length ? <Button className="mb-4" variant="danger" leftIcon={<Trash2 className="h-4 w-4" />} onClick={() => setConfirmOpen(true)}>Delete selected ({checked.length})</Button> : null}
        {isLoading ? <Skeleton height="360px" /> : responses.length ? (
          <>
            <div className="hidden overflow-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="text-text-secondary"><tr><th className="p-3"><input type="checkbox" checked={checked.length === responses.length} onChange={(event) => setChecked(event.target.checked ? responses.map((item) => item._id) : [])} /></th><th className="p-3">#</th><th className="p-3">Submitted At</th><th className="p-3">Time</th>{fields.map((field) => <th key={field.id} className="p-3">{field.label}</th>)}</tr></thead>
                <tbody>{responses.map((response, index) => <tr key={response._id} className="cursor-pointer border-t border-border hover:bg-white/5" onClick={() => setSelected(response)}><td className="p-3" onClick={(event) => event.stopPropagation()}><input type="checkbox" checked={checked.includes(response._id)} onChange={(event) => setChecked(event.target.checked ? [...checked, response._id] : checked.filter((id) => id !== response._id))} /></td><td className="p-3">{index + 1}</td><td className="p-3">{formatDate(response.createdAt)}</td><td className="p-3">{formatDuration(response.metadata.timeToCompleteSeconds)}</td>{fields.map((field) => <td key={field.id} className="max-w-40 truncate p-3">{formatAnswer(response.answers[field.id])}</td>)}</tr>)}</tbody>
              </table>
            </div>
            <div className="space-y-3 md:hidden">{responses.map((response) => <button key={response._id} className="w-full rounded-lg border border-border p-4 text-left" onClick={() => setSelected(response)}><p className="font-semibold text-white">{formatDate(response.createdAt)}</p><p className="text-sm text-text-secondary">{formatDuration(response.metadata.timeToCompleteSeconds)}</p></button>)}</div>
          </>
        ) : <EmptyState icon={Inbox} title="No responses yet" description="Submit the public form to see responses here." />}
      </Card>
      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title="Response Detail" size="lg">
        <div className="space-y-3">{selected && fields.map((field) => { const value = selected.answers[field.id]; return <div key={field.id} className="rounded-lg border border-border p-3"><p className="text-sm text-text-secondary">{field.label}</p><p className="mt-1 font-medium text-white">{field.type === "rating" ? <span className="text-warning">{Array.from({ length: Number(value ?? 0) }).map((_, index) => <Star key={index} className="inline h-4 w-4 fill-current" />)}</span> : Array.isArray(value) ? value.map((item) => <Badge key={item} className="mr-2" variant="primary">{item}</Badge>) : formatAnswer(value)}</p></div>; })}</div>
      </Modal>
      <ConfirmModal isOpen={confirmOpen} title="Delete responses" message="Selected responses will be permanently deleted." confirmLabel="Delete" confirmVariant="danger" onConfirm={bulkDelete} onCancel={() => setConfirmOpen(false)} />
    </div>
  );
}
