"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  FileText,
  GripVertical,
  Plus,
  Settings,
  Share2,
  Trash2,
} from "lucide-react";
import QRCode from "qrcode";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { useToast } from "@/components/ui/Toast";
import { createDefaultField } from "@/lib/defaults";
import { cn } from "@/lib/utils";
import type { FieldType, FormDocumentShape, FormField, FormSettings } from "@/types";
import { fieldTypes } from "./fieldTypes";

function FieldPalette({ onAdd }: { onAdd: (type: FieldType) => void }) {
  return (
    <div className="h-full overflow-y-auto p-4 pb-24 custom-scrollbar">
      <div className="mb-4 flex items-center justify-between pb-2 border-b border-white/[0.06]">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">
          Add Components
        </span>
        <span className="text-[10px] text-[#64748b]">12 elements</span>
      </div>
      {(["Basic", "Choice", "Advanced", "Layout"] as const).map((group) => (
        <div key={group} className="mb-5">
          <h3 className="mb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748b]">
            {group}
          </h3>
          <div className="space-y-1.5">
            {fieldTypes
              .filter((field) => field.group === group)
              .map((field) => (
                <PaletteItem key={field.type} field={field} onAdd={onAdd} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PaletteItem({
  field,
  onAdd,
}: {
  field: (typeof fieldTypes)[number];
  onAdd: (type: FieldType) => void;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `palette:${field.type}`,
  });
  return (
    <button
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...listeners}
      {...attributes}
      onClick={() => onAdd(field.type)}
      className="flex w-full items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 text-left transition-all hover:border-violet-400/40 hover:bg-white/[0.05] cursor-pointer group"
    >
      <div className="grid h-7 w-7 place-items-center rounded bg-violet-500/10 text-violet-300 group-hover:bg-violet-500/20 group-hover:text-white transition">
        <field.icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <span className="block text-xs font-semibold text-white group-hover:text-violet-200">
          {field.label}
        </span>
        <span className="block truncate text-[10px] text-[#64748b]">
          {field.description}
        </span>
      </div>
    </button>
  );
}

function FieldPreview({ field }: { field: FormField }) {
  if (field.type === "section_break")
    return (
      <div className="border-t border-white/[0.08] pt-3">
        <h3 className="font-semibold text-white">{field.settings.sectionTitle || field.label}</h3>
        {field.settings.sectionDescription ? (
          <p className="mt-1 text-xs text-[#94a3b8]">{field.settings.sectionDescription}</p>
        ) : null}
      </div>
    );
  if (field.type === "rating")
    return (
      <div className="flex gap-1.5 text-amber-400 text-lg">
        {Array.from({ length: field.settings.maxRating ?? 5 }).map((_, index) => (
          <span key={index}>★</span>
        ))}
      </div>
    );
  if (["multiple_choice", "checkboxes"].includes(field.type))
    return (
      <div className="space-y-1.5">
        {field.options.map((option) => (
          <div
            key={option}
            className="flex items-center gap-2.5 rounded border border-white/[0.06] bg-black/20 px-3 py-2 text-xs text-[#94a3b8]"
          >
            <span className="h-3 w-3 rounded-full border border-white/20" />
            <span>{option}</span>
          </div>
        ))}
      </div>
    );
  return (
    <div className="h-10 rounded-lg border border-white/[0.08] bg-[#0c1017] px-3.5 flex items-center text-xs text-[#64748b]">
      {field.placeholder || "Answer will appear here..."}
    </div>
  );
}

function SortableField({
  field,
  selected,
  onSelect,
  onDuplicate,
  onDelete,
}: {
  field: FormField;
  selected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: field.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      onClick={onSelect}
      className={cn(
        "group relative rounded-2xl border p-5 transition-all duration-200 cursor-pointer shadow-sm",
        selected
          ? "border-violet-500/80 bg-[#1c1c1c] shadow-[0_10px_30px_-10px_rgba(139,92,246,0.3)] ring-1 ring-violet-500/50"
          : "border-white/[0.08] bg-[#171717] hover:border-white/20 hover:bg-[#1a1a1a]"
      )}
    >
      <div className="flex items-start gap-3">
        <button
          className="mt-1 cursor-grab text-[#64748b] hover:text-white transition"
          {...attributes}
          {...listeners}
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white">
                {field.label} {field.required ? <span className="text-red-400">*</span> : null}
              </h3>
              {field.helperText ? (
                <p className="mt-0.5 text-xs text-[#94a3b8]">{field.helperText}</p>
              ) : null}
            </div>
            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
              <button
                className="rounded p-1 text-[#64748b] hover:text-white transition cursor-pointer"
                onClick={(event) => {
                  event.stopPropagation();
                  onDuplicate();
                }}
                title="Duplicate question"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button
                className="rounded p-1 text-[#64748b] hover:text-red-400 transition cursor-pointer"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete();
                }}
                title="Delete question"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <FieldPreview field={field} />
        </div>
      </div>
    </div>
  );
}

function FieldSettingsPanel({
  field,
  onChange,
}: {
  field?: FormField;
  onChange: (field: FormField) => void;
}) {
  const [tab, setTab] = useState<"settings" | "validation">("settings");
  if (!field)
    return (
      <div className="p-6">
        <EmptyState
          icon={Settings}
          title="No field selected"
          description="Click any question in the canvas to customize its label, options, and rules."
        />
      </div>
    );

  const patch = (partial: Partial<FormField>) => onChange({ ...field, ...partial });
  const patchSettings = (settings: Partial<FormField["settings"]>) =>
    onChange({ ...field, settings: { ...field.settings, ...settings } });
  const choice = ["multiple_choice", "checkboxes", "dropdown"].includes(field.type);

  return (
    <div className="h-full overflow-y-auto p-4 pb-28 custom-scrollbar">
      <div className="mb-4 flex items-center justify-between pb-2 border-b border-white/[0.06]">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">
          Inspector
        </span>
        <Badge variant="cyan" size="sm">
          {field.type}
        </Badge>
      </div>

      <div className="mb-5 grid grid-cols-2 rounded-lg bg-black/40 p-1 border border-white/[0.06]">
        <button
          className={cn(
            "h-8 rounded text-xs font-medium transition cursor-pointer",
            tab === "settings" ? "bg-violet-600 text-white" : "text-[#94a3b8] hover:text-white",
          )}
          onClick={() => setTab("settings")}
        >
          General
        </button>
        <button
          className={cn(
            "h-8 rounded text-xs font-medium transition cursor-pointer",
            tab === "validation" ? "bg-violet-600 text-white" : "text-[#94a3b8] hover:text-white",
          )}
          onClick={() => setTab("validation")}
        >
          Validation
        </button>
      </div>

      {tab === "settings" ? (
        <div className="space-y-4">
          <Input
            label="Field Label"
            value={field.label}
            onChange={(event) => patch({ label: event.target.value })}
            required
          />
          {!["rating", "section_break", "checkboxes"].includes(field.type) ? (
            <Input
              label="Placeholder text"
              value={field.placeholder ?? ""}
              onChange={(event) => patch({ placeholder: event.target.value })}
            />
          ) : null}
          <Input
            label="Helper Description"
            value={field.helperText ?? ""}
            onChange={(event) => patch({ helperText: event.target.value })}
          />
          {field.type !== "section_break" ? (
            <div className="pt-2">
              <Toggle
                label="Required field"
                checked={field.required}
                onChange={(checked) => patch({ required: checked })}
              />
            </div>
          ) : null}
          {choice ? (
            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-[#94a3b8]">
                  Choices
                </span>
                <span className="text-[10px] text-[#64748b]">{field.options.length} items</span>
              </div>
              {field.options.map((option, index) => (
                <div key={`${option}-${index}`} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(event) =>
                      patch({
                        options: field.options.map((item, itemIndex) =>
                          itemIndex === index ? event.target.value : item,
                        ),
                      })
                    }
                  />
                  <button
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 text-[#94a3b8] hover:text-red-400 cursor-pointer"
                    onClick={() =>
                      patch({
                        options: field.options.filter((_, itemIndex) => itemIndex !== index),
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                fullWidth
                leftIcon={<Plus className="h-3.5 w-3.5" />}
                onClick={() =>
                  patch({ options: [...field.options, `Option ${field.options.length + 1}`] })
                }
              >
                Add Option
              </Button>
            </div>
          ) : null}
          {field.type === "rating" ? (
            <div className="space-y-3 pt-2 border-t border-white/[0.06]">
              <Select
                label="Max rating stars"
                value={String(field.settings.maxRating ?? 5)}
                onChange={(event) =>
                  patchSettings({ maxRating: Number(event.target.value) as 3 | 5 | 10 })
                }
                options={[3, 5, 10].map((item) => ({ value: String(item), label: `${item} Stars` }))}
              />
              <Input
                label="Lowest Label (e.g. Terrible)"
                value={field.settings.minLabel ?? ""}
                onChange={(event) => patchSettings({ minLabel: event.target.value })}
              />
              <Input
                label="Highest Label (e.g. Excellent)"
                value={field.settings.maxLabel ?? ""}
                onChange={(event) => patchSettings({ maxLabel: event.target.value })}
              />
            </div>
          ) : null}
          {field.type === "number" ? (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06]">
              <Input
                label="Min Value"
                type="number"
                value={field.settings.minValue ?? ""}
                onChange={(event) => patchSettings({ minValue: Number(event.target.value) })}
              />
              <Input
                label="Max Value"
                type="number"
                value={field.settings.maxValue ?? ""}
                onChange={(event) => patchSettings({ maxValue: Number(event.target.value) })}
              />
            </div>
          ) : null}
          {field.type === "section_break" ? (
            <div className="space-y-3 pt-2 border-t border-white/[0.06]">
              <Input
                label="Section Header"
                value={field.settings.sectionTitle ?? ""}
                onChange={(event) => patchSettings({ sectionTitle: event.target.value })}
              />
              <Textarea
                label="Section Description"
                value={field.settings.sectionDescription ?? ""}
                onChange={(event) => patchSettings({ sectionDescription: event.target.value })}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <div className="space-y-4">
          {["short_text", "long_text"].includes(field.type) ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Min Characters"
                  type="number"
                  value={field.settings.minLength ?? ""}
                  onChange={(event) => patchSettings({ minLength: Number(event.target.value) })}
                />
                <Input
                  label="Max Characters"
                  type="number"
                  value={field.settings.maxLength ?? ""}
                  onChange={(event) => patchSettings({ maxLength: Number(event.target.value) })}
                />
              </div>
              <Input
                label="Custom Validation Error Message"
                value={field.settings.customErrorMessage ?? ""}
                onChange={(event) => patchSettings({ customErrorMessage: event.target.value })}
                placeholder="e.g. Please provide a detailed response"
              />
            </>
          ) : (
            <p className="py-6 text-center text-xs text-[#64748b]">
              Text validation constraints are available for text-based fields.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function BuilderClient({ initialForm }: { initialForm: FormDocumentShape }) {
  const toast = useToast();
  const [form, setForm] = useState(initialForm);
  const [selectedId, setSelectedId] = useState(initialForm.fields[0]?.id);
  const [mobileTab, setMobileTab] = useState<"palette" | "canvas" | "settings">("canvas");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [qr, setQr] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const selected = form.fields.find((field) => field.id === selectedId);
  const publicUrl = `${typeof window === "undefined" ? "" : window.location.origin}/f/${form.slug}`;

  const save = useCallback(async (next: FormDocumentShape) => {
    setForm(next);
    setSaving(true);
    try {
      await fetch(`/api/forms/${next._id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: next.title,
          description: next.description,
          fields: next.fields,
          settings: next.settings,
          status: next.status,
        }),
      });
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    if (shareOpen) {
      QRCode.toDataURL(publicUrl, { width: 240, margin: 2 })
        .then(setQr)
        .catch(() => setQr(""));
    }
  }, [shareOpen, publicUrl]);

  function addField(type: FieldType) {
    const field = createDefaultField(type);
    void save({ ...form, fields: [...form.fields, field] });
    setSelectedId(field.id);
    setMobileTab("canvas");
  }

  function updateField(field: FormField) {
    void save({
      ...form,
      fields: form.fields.map((item) => (item.id === field.id ? field : item)),
    });
  }

  function duplicateField(field: FormField) {
    const copy = { ...field, id: crypto.randomUUID(), label: `${field.label} copy` };
    const index = form.fields.findIndex((item) => item.id === field.id);
    void save({
      ...form,
      fields: [...form.fields.slice(0, index + 1), copy, ...form.fields.slice(index + 1)],
    });
    setSelectedId(copy.id);
  }

  function removeField() {
    if (!deleteId) return;
    void save({ ...form, fields: form.fields.filter((field) => field.id !== deleteId) });
    setDeleteId(null);
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    if (activeId.startsWith("palette:")) {
      addField(activeId.replace("palette:", "") as FieldType);
    } else if (active.id !== over.id) {
      const oldIndex = form.fields.findIndex((field) => field.id === active.id);
      const newIndex = form.fields.findIndex((field) => field.id === over.id);
      void save({ ...form, fields: arrayMove(form.fields, oldIndex, newIndex) });
    }
  }

  function updateSettings(settings: FormSettings) {
    void save({ ...form, settings });
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <div className="flex h-[calc(100vh-9.5rem)] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141414] shadow-2xl">
        {/* Builder Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] bg-[#161616] px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Link
              href="/forms"
              className="flex size-8 items-center justify-center rounded-xl border border-white/10 text-neutral-400 hover:text-white transition"
              title="Back to Forms"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              onBlur={() => save(form)}
              className="h-8 max-w-[240px] md:max-w-xs rounded-lg bg-transparent px-2 font-bold text-neutral-100 outline-none transition hover:bg-white/[0.04] focus:bg-white/[0.08] focus:ring-1 focus:ring-violet-400"
            />
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.04] text-neutral-300">
              {form.status}
            </span>
            {saving ? (
              <span className="font-mono text-[10px] text-violet-400 animate-pulse">Saving...</span>
            ) : (
              <span className="font-mono text-[10px] text-neutral-400">Saved</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ExternalLink className="h-3.5 w-3.5" />}
              onClick={() => window.open(`/f/${form.slug}`, "_blank")}
            >
              Preview
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Share2 className="h-3.5 w-3.5" />}
              onClick={() => setShareOpen(true)}
            >
              Share
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Settings className="h-3.5 w-3.5" />}
              onClick={() => setSettingsOpen(true)}
            >
              Settings
            </Button>
            {form.status !== "active" ? (
              <Button
                size="sm"
                leftIcon={<Check className="h-3.5 w-3.5" />}
                onClick={() => setPublishOpen(true)}
              >
                Publish Form
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  void save({ ...form, status: "closed" });
                  toast.success("Form closed");
                }}
              >
                Close Form
              </Button>
            )}
          </div>
        </div>

        {/* 3-Column Studio Workspace */}
        <div className="grid flex-1 overflow-hidden md:grid-cols-[260px_1fr_320px]">
          {/* Left Column: Component Palette */}
          <section className={cn("h-full overflow-hidden border-r border-white/[0.08] bg-[#0c1018]/40 md:block", mobileTab !== "palette" && "hidden")}>
            <FieldPalette onAdd={addField} />
          </section>

          {/* Center Column: Drag-and-drop Canvas */}
          <section className={cn("h-full overflow-y-auto p-6 custom-scrollbar md:block bg-[#090d16]", mobileTab !== "canvas" && "hidden")}>
            <SortableContext items={form.fields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
              <div className="mx-auto max-w-2xl space-y-3 pb-36">
                {form.fields.length ? (
                  form.fields.map((field) => (
                    <SortableField
                      key={field.id}
                      field={field}
                      selected={selectedId === field.id}
                      onSelect={() => setSelectedId(field.id)}
                      onDuplicate={() => duplicateField(field)}
                      onDelete={() => setDeleteId(field.id)}
                    />
                  ))
                ) : (
                  <EmptyState
                    icon={FileText}
                    title="No questions in your canvas"
                    description="Click on any component in the left panel to add it to your form flow."
                    action={{ label: "Add Short Text", onClick: () => addField("short_text") }}
                  />
                )}
              </div>
            </SortableContext>
          </section>

          {/* Right Column: Properties Inspector */}
          <section className={cn("h-full overflow-hidden border-l border-white/[0.08] bg-[#0c1018]/40 md:block", mobileTab !== "settings" && "hidden")}>
            <FieldSettingsPanel field={selected} onChange={updateField} />
          </section>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="grid grid-cols-3 border-t border-white/[0.08] bg-[#0c1018] md:hidden">
          {(["palette", "canvas", "settings"] as const).map((tab) => (
            <button
              key={tab}
              className={cn(
                "h-11 capitalize text-xs font-semibold tracking-wider",
                mobileTab === tab ? "text-violet-400 border-t-2 border-violet-400 bg-violet-500/10" : "text-[#94a3b8]",
              )}
              onClick={() => setMobileTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Confirmation & Sharing Modals */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Delete Question"
        message="Remove this question from your form canvas?"
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={removeField}
        onCancel={() => setDeleteId(null)}
      />

      <ConfirmModal
        isOpen={publishOpen}
        title="Publish Live Form"
        message="Your form will become publicly accessible and accept live respondent submissions."
        confirmLabel="Publish Now"
        onConfirm={() => {
          void save({ ...form, status: "active" });
          setPublishOpen(false);
          toast.success("Form is now live!");
        }}
        onCancel={() => setPublishOpen(false)}
      />

      <Modal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} title="Form Settings" size="lg">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Form Title"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
          />
          <Textarea
            label="Form Description"
            value={form.description ?? ""}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
          <Input
            label="Submit Button Label"
            value={form.settings.submitButtonLabel}
            onChange={(event) => updateSettings({ ...form.settings, submitButtonLabel: event.target.value })}
          />
          <Textarea
            label="Success Thank-You Message"
            value={form.settings.thankYouMessage}
            onChange={(event) => updateSettings({ ...form.settings, thankYouMessage: event.target.value })}
          />
          <Select
            label="Display Mode"
            value={form.settings.displayMode}
            onChange={(event) =>
              updateSettings({
                ...form.settings,
                displayMode: event.target.value as "classic" | "conversational",
              })
            }
            options={[
              { value: "classic", label: "Classic (All on one page)" },
              { value: "conversational", label: "Conversational (One at a time)" },
            ]}
          />
          <Input
            label="Owner Notification Email"
            value={form.settings.notifications.notificationEmail ?? ""}
            onChange={(event) =>
              updateSettings({
                ...form.settings,
                notifications: {
                  ...form.settings.notifications,
                  notificationEmail: event.target.value,
                },
              })
            }
          />
        </div>
      </Modal>

      <Modal isOpen={shareOpen} onClose={() => setShareOpen(false)} title="Share Form" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#94a3b8] mb-1.5">
              Public Link
            </label>
            <div className="flex gap-2">
              <Input value={publicUrl} readOnly />
              <Button
                leftIcon={<Copy className="h-4 w-4" />}
                onClick={() => {
                  navigator.clipboard.writeText(publicUrl);
                  toast.success("Link copied to clipboard");
                }}
              >
                Copy
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#94a3b8] mb-1.5">
              IFrame Embed Code
            </label>
            <Textarea
              readOnly
              rows={3}
              value={`<iframe src="${publicUrl}" style="width:100%;border:0;min-height:640px" loading="lazy"></iframe>`}
            />
          </div>

          {qr ? (
            <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/10 bg-white/[0.02]">
              <img src={qr} alt="QR Code" className="h-40 w-40 rounded-lg p-2 bg-white" />
              <a
                href={qr}
                download="formcraft-qr.png"
                className="mt-3 text-xs font-medium text-violet-300 hover:text-white transition"
              >
                Download QR Code Image (PNG)
              </a>
            </div>
          ) : null}
        </div>
      </Modal>
    </DndContext>
  );
}
