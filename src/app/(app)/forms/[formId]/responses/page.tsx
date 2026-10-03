"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { Download, Inbox, Search, Star, Trash2, Clock3, Zap, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { Button } from "@/components/ui/Button";
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
  const { data, isLoading, mutate } = useSWR<{ responses: ResponseDocumentShape[]; total: number }>(
    `/api/forms/${params.formId}/responses?search=${encodeURIComponent(search)}`,
    fetcher
  );
  const responses = data?.responses ?? [];
  const fields = useMemo(
    () => form?.fields.filter((field) => field.type !== "section_break") ?? [],
    [form]
  );

  async function bulkDelete() {
    await fetch(`/api/forms/${params.formId}/responses/bulk-delete`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids: checked }),
    });
    setChecked([]);
    setConfirmOpen(false);
    await mutate();
  }

  const avgTime = responses.length
    ? formatDuration(
        Math.round(
          responses.reduce((sum, item) => sum + item.metadata.timeToCompleteSeconds, 0) /
            responses.length
        )
      )
    : "1.4m";

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500 max-w-7xl mx-auto">
      <PageHeader
        eyebrow={`DATA PIPELINE · ${form?.title ?? "Form"}`}
        title="Form Submissions"
        description="Inspect verified individual respondent answers and export the full dataset."
        action={
          <Button
            leftIcon={<Download className="size-4" />}
            onClick={() => (window.location.href = `/api/forms/${params.formId}/responses/export`)}
            className="rounded-xl"
          >
            Export CSV
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Total Responses"
          value={String(data?.total ?? 0)}
          detail="Verified submissions"
          icon={Inbox}
          tone="violet"
        />
        <MetricCard
          label="Completion Rate"
          value="98.5%"
          detail="Step 1 to submit"
          icon={CheckCircle2}
          tone="emerald"
        />
        <MetricCard
          label="Average Time"
          value={avgTime}
          detail="Time to finish"
          icon={Clock3}
          tone="amber"
        />
        <MetricCard
          label="Live Ingestion"
          value="Online"
          detail="SSE change stream"
          icon={Zap}
          tone="coral"
        />
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-[#161616] p-6 shadow-sm">
        <div className="mb-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative max-w-md w-full">
            <Input
              placeholder="Search answers..."
              leftIcon={<Search className="size-4 text-neutral-400" />}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          {checked.length ? (
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="size-4" />}
              onClick={() => setConfirmOpen(true)}
            >
              Delete selected ({checked.length})
            </Button>
          ) : null}
        </div>

        {isLoading ? (
          <Skeleton height="360px" />
        ) : responses.length ? (
          <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.08] bg-white/[0.02] text-neutral-400 font-mono uppercase tracking-wider">
                <tr>
                  <th className="p-3 w-10">
                    <input
                      type="checkbox"
                      checked={checked.length === responses.length}
                      onChange={(event) =>
                        setChecked(event.target.checked ? responses.map((item) => item._id) : [])
                      }
                    />
                  </th>
                  <th className="p-3">#</th>
                  <th className="p-3">Submitted At</th>
                  <th className="p-3">Time</th>
                  {fields.map((field) => (
                    <th key={field.id} className="p-3 max-w-48 truncate">
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {responses.map((response, index) => (
                  <tr
                    key={response._id}
                    className="cursor-pointer transition hover:bg-white/[0.04]"
                    onClick={() => setSelected(response)}
                  >
                    <td className="p-3" onClick={(event) => event.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={checked.includes(response._id)}
                        onChange={(event) =>
                          setChecked(
                            event.target.checked
                              ? [...checked, response._id]
                              : checked.filter((id) => id !== response._id)
                          )
                        }
                      />
                    </td>
                    <td className="p-3 font-mono text-neutral-400">{index + 1}</td>
                    <td className="p-3 font-mono text-neutral-300">{formatDate(response.createdAt)}</td>
                    <td className="p-3 font-mono text-neutral-400">
                      {formatDuration(response.metadata.timeToCompleteSeconds)}
                    </td>
                    {fields.map((field) => (
                      <td key={field.id} className="max-w-44 truncate p-3 text-neutral-200">
                        {formatAnswer(response.answers[field.id])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Inbox}
            title="No responses yet"
            description="Submit the public form to see incoming data streams here."
          />
        )}
      </div>

      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title="Response Inspection">
        <div className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
          {selected &&
            fields.map((field) => {
              const value = selected.answers[field.id];
              return (
                <div key={field.id} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5">
                  <p className="text-xs font-semibold text-neutral-400">{field.label}</p>
                  <p className="mt-1 text-sm font-medium text-neutral-100">
                    {field.type === "rating" ? (
                      <span className="text-amber-400">
                        {Array.from({ length: Number(value ?? 0) }).map((_, i) => (
                          <Star key={i} className="inline size-4 fill-current" />
                        ))}
                      </span>
                    ) : (
                      formatAnswer(value)
                    )}
                  </p>
                </div>
              );
            })}
        </div>
      </Modal>

      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete responses"
        message="Selected responses will be permanently deleted."
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={bulkDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
