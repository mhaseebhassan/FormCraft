"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { Copy, Edit, Eye, FileText, MoreVertical, Plus, Share2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { formTemplates } from "@/lib/templates";
import { formatDate } from "@/lib/utils";
import type { FormDocumentShape, FormStatus } from "@/types";

const fetcher = (url: string) => fetch(url).then((response) => response.json());
const statusVariant: Record<FormStatus, "neutral" | "success" | "danger"> = { draft: "neutral", active: "success", closed: "danger" };

export default function FormsPage() {
  const toast = useToast();
  const { data, isLoading, mutate } = useSWR<FormDocumentShape[]>("/api/forms", fetcher);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [newOpen, setNewOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [title, setTitle] = useState("Untitled Form");
  const [templateId, setTemplateId] = useState("");

  const forms = useMemo(() => (data ?? []).filter((form) => (status === "all" || form.status === status) && form.title.toLowerCase().includes(search.toLowerCase())), [data, search, status]);

  async function createForm() {
    const response = await fetch("/api/forms", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title, templateId: templateId || undefined }) });
    if (!response.ok) {
      toast.error("Could not create form");
      return;
    }
    const form = (await response.json()) as FormDocumentShape;
    toast.success("Form created");
    window.location.href = `/forms/${form._id}/edit`;
  }

  async function updateForm(formId: string, body: Record<string, unknown>) {
    await fetch(`/api/forms/${formId}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    await mutate();
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
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">My Forms</h2>
          <p className="text-sm text-text-secondary">Create, edit, share, duplicate, close, and delete forms.</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setNewOpen(true)}>New Form</Button>
      </div>
      <Card>
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <Input placeholder="Search forms" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Select value={status} onChange={(event) => setStatus(event.target.value)} options={[{ value: "all", label: "All" }, { value: "draft", label: "Draft" }, { value: "active", label: "Active" }, { value: "closed", label: "Closed" }]} />
        </div>
      </Card>
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">{[0, 1, 2, 3, 4, 5].map((item) => <Card key={item}><Skeleton height="130px" /></Card>)}</div>
      ) : forms.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {forms.map((form) => (
            <Card key={form._id} hover>
              <div className="flex items-start justify-between gap-4">
                <Link href={`/forms/${form._id}/edit`} className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-semibold text-white">{form.title}</h3>
                  <p className="mt-2 text-sm text-text-secondary">{form.description || "No description"}</p>
                </Link>
                <div className="group relative">
                  <Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button>
                  <div className="invisible absolute right-0 z-20 w-48 rounded-lg border border-border bg-surface p-2 opacity-0 shadow-xl group-hover:visible group-hover:opacity-100">
                    <Link className="flex min-h-10 items-center gap-2 rounded px-2 text-sm text-text-secondary hover:bg-white/5 hover:text-white" href={`/forms/${form._id}/edit`}><Edit className="h-4 w-4" />Edit</Link>
                    <Link className="flex min-h-10 items-center gap-2 rounded px-2 text-sm text-text-secondary hover:bg-white/5 hover:text-white" href={`/f/${form.slug}`} target="_blank"><Eye className="h-4 w-4" />Preview</Link>
                    <button className="flex min-h-10 w-full items-center gap-2 rounded px-2 text-sm text-text-secondary hover:bg-white/5 hover:text-white" onClick={() => duplicate(form._id)}><Copy className="h-4 w-4" />Duplicate</button>
                    <button className="flex min-h-10 w-full items-center gap-2 rounded px-2 text-sm text-text-secondary hover:bg-white/5 hover:text-white" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/f/${form.slug}`)}><Share2 className="h-4 w-4" />Share</button>
                    <button className="flex min-h-10 w-full items-center gap-2 rounded px-2 text-sm text-text-secondary hover:bg-white/5 hover:text-white" onClick={() => updateForm(form._id, { status: form.status === "closed" ? "active" : "closed" })}>{form.status === "closed" ? "Reopen Form" : "Close Form"}</button>
                    <button className="flex min-h-10 w-full items-center gap-2 rounded px-2 text-sm text-red-300 hover:bg-danger/10" onClick={() => setDeleteId(form._id)}><Trash2 className="h-4 w-4" />Delete</button>
                  </div>
                </div>
              </div>
              <div className="mt-5 grid gap-3 text-sm text-text-secondary md:grid-cols-3">
                <span><Badge variant={statusVariant[form.status]}>{form.status}</Badge></span>
                <span className="flex items-center gap-2"><FileText className="h-4 w-4" />{form.responseCount} responses</span>
                <span>{formatDate(form.lastResponseAt)}</span>
              </div>
              <p className="mt-3 text-xs text-text-secondary">Created {formatDate(form.createdAt)}</p>
            </Card>
          ))}
        </div>
      ) : <EmptyState icon={FileText} title="No forms yet" description="Create your first form from scratch or start with a proven template." action={{ label: "Create your first form", onClick: () => setNewOpen(true) }} />}

      <Modal isOpen={newOpen} onClose={() => setNewOpen(false)} title="New Form">
        <div className="space-y-4">
          <Input label="Form title" required value={title} onChange={(event) => setTitle(event.target.value)} />
          <Select label="Start from a template" placeholder="Start from scratch" value={templateId} onChange={(event) => setTemplateId(event.target.value)} options={formTemplates.map((template) => ({ value: template.id, label: template.name }))} />
          <div className="grid gap-3 md:grid-cols-2">
            {formTemplates.map((template) => (
              <button key={template.id} type="button" onClick={() => setTemplateId(template.id)} className={`rounded-lg border p-3 text-left ${templateId === template.id ? "border-primary bg-primary/10" : "border-border bg-white/5"}`}>
                <p className="font-semibold text-white">{template.name}</p>
                <p className="mt-1 text-xs text-text-secondary">{template.description}</p>
              </button>
            ))}
          </div>
          <Button fullWidth onClick={createForm}>Create Form</Button>
        </div>
      </Modal>
      <ConfirmModal isOpen={Boolean(deleteId)} title="Delete form" message="This deletes the form, responses, and notifications. This action cannot be undone." confirmLabel="Delete" confirmVariant="danger" onConfirm={remove} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
