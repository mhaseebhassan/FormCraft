"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import useSWR from "swr";
import {
  BarChart3,
  Copy,
  Edit3,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Inbox,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { formTemplates } from "@/lib/templates";
import type { FormDocumentShape } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function FormsPage() {
  const router = useRouter();
  const toast = useToast();
  const { data, isLoading, mutate } = useSWR<FormDocumentShape[]>("/api/forms", fetcher);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [newOpen, setNewOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [title, setTitle] = useState("Untitled Form");
  const [templateId, setTemplateId] = useState("");
  const [creating, setCreating] = useState(false);

  const forms = useMemo(
    () =>
      (data ?? []).filter(
        (form) =>
          (status === "all" || form.status === status) &&
          form.title.toLowerCase().includes(search.toLowerCase())
      ),
    [data, search, status]
  );

  async function createForm() {
    if (!title.trim()) {
      toast.error("Form title is required");
      return;
    }
    setCreating(true);
    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, templateId: templateId || undefined }),
      });
      if (!response.ok) {
        toast.error("Could not create form");
        return;
      }
      const form = (await response.json()) as FormDocumentShape;
      toast.success("Form created successfully");
      router.push(`/forms/${form._id}/edit`);
    } finally {
      setCreating(false);
    }
  }

  async function duplicate(formId: string) {
    await fetch(`/api/forms/${formId}/duplicate`, { method: "POST" });
    toast.success("Form duplicated");
    await mutate();
  }

  async function remove() {
    if (!deleteId) return;
    await fetch(`/api/forms/${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    toast.success("Form deleted");
    await mutate();
  }

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        eyebrow="Forms Collection · 10 Active Forms"
        title="Forms Library"
        description="Inspect, publish, and configure your forms with real-time response ingestion."
        action={
          <Button
            leftIcon={<Plus className="size-4" />}
            onClick={() => setNewOpen(true)}
            className="rounded-xl"
          >
            Create New Form
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-[#161616] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search forms by title or slug..."
            leftIcon={<Search className="size-4 text-neutral-400" />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {["all", "active", "draft", "closed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition ${
                status === s
                  ? "bg-white/[0.12] text-white shadow-sm"
                  : "text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Forms Grid */}
      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-48 animate-pulse rounded-2xl border border-white/[0.08] bg-[#1a1a1a]"
            />
          ))}
        </div>
      ) : forms.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <SpotlightCard
              key={form._id}
              tint="violet"
              className="p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <StatusPill status={form.status} />
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => duplicate(form._id)}
                      className="rounded-lg p-1 text-neutral-400 hover:bg-white/[0.06] hover:text-white transition"
                      title="Duplicate form"
                    >
                      <Copy className="size-3.5" />
                    </button>
                    <Link
                      href={`/f/${form.slug}`}
                      target="_blank"
                      className="rounded-lg p-1 text-neutral-400 hover:bg-white/[0.06] hover:text-white transition"
                      title="Preview public form"
                    >
                      <ExternalLink className="size-3.5" />
                    </Link>
                    <button
                      onClick={() => setDeleteId(form._id)}
                      className="rounded-lg p-1 text-neutral-400 hover:bg-rose-500/10 hover:text-rose-400 transition"
                      title="Delete form"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    href={`/forms/${form._id}/edit`}
                    className="font-heading text-lg font-bold text-neutral-100 transition hover:text-violet-400 block"
                  >
                    {form.title}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-400">
                    {form.description || "Interactive respondent form with schema validation."}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-white/[0.08] pt-4">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-3.5">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Inbox className="size-3.5 text-violet-400" />
                    {form.responseCount} responses
                  </span>
                  <span className="flex items-center gap-1.5 font-mono">
                    <Zap className="size-3.5 text-emerald-400" />
                    {form.fields?.length || 5} questions
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/forms/${form._id}/edit`}
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] py-1.5 text-center text-xs font-semibold text-neutral-200 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    Studio
                  </Link>
                  <Link
                    href={`/forms/${form._id}/responses`}
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] py-1.5 text-center text-xs font-semibold text-neutral-200 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    Responses
                  </Link>
                  <Link
                    href={`/forms/${form._id}/analytics`}
                    className="rounded-xl border border-white/10 bg-white/[0.04] p-1.5 text-neutral-400 transition hover:bg-white/[0.08] hover:text-white"
                    title="View Analytics"
                  >
                    <BarChart3 className="size-4" />
                  </Link>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No forms found"
          description="Create your first form to start collecting responses."
          action={{ label: "Create Form", onClick: () => setNewOpen(true) }}
        />
      )}

      {/* New Form Modal */}
      <Modal isOpen={newOpen} onClose={() => setNewOpen(false)} title="Create New Form">
        <div className="space-y-4">
          <Input
            label="Form Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. User Feedback 2026"
          />

          <div>
            <label className="mb-2 block text-xs font-medium text-neutral-300">
              Template (Optional)
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setTemplateId("")}
                className={`rounded-xl border p-3 text-left transition ${
                  templateId === ""
                    ? "border-violet-500 bg-violet-500/10 text-white"
                    : "border-white/10 bg-white/[0.02] text-neutral-300 hover:bg-white/[0.05]"
                }`}
              >
                <p className="text-xs font-semibold">Blank Form</p>
                <p className="text-[10px] text-neutral-400 mt-1">Start from scratch</p>
              </button>

              {formTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setTemplateId(template.id)}
                  className={`rounded-xl border p-3 text-left transition ${
                    templateId === template.id
                      ? "border-violet-500 bg-violet-500/10 text-white"
                      : "border-white/10 bg-white/[0.02] text-neutral-300 hover:bg-white/[0.05]"
                  }`}
                >
                  <p className="text-xs font-semibold">{template.name}</p>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    {template.fields.length} pre-built questions
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/[0.08]">
            <Button variant="ghost" onClick={() => setNewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createForm} loading={creating}>
              Create & Open Studio
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        onCancel={() => setDeleteId(null)}
        onConfirm={remove}
        title="Delete Form"
        message="Are you sure you want to delete this form? All associated submissions and responses will also be removed."
        confirmLabel="Delete Permanently"
        confirmVariant="danger"
      />
    </div>
  );
}
