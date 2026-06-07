"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useDraggable, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, Copy, FileText, GripVertical, Plus, Save, Settings, Share2, Trash2 } from "lucide-react";
import QRCode from "qrcode";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ColorPicker } from "@/components/ui/ColorPicker";
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
    <div className="h-full overflow-auto p-4">
      {(["Basic", "Choice", "Advanced", "Layout"] as const).map((group) => (
        <div key={group} className="mb-5">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-text-secondary">{group}</h3>
          <div className="space-y-2">
            {fieldTypes.filter((field) => field.group === group).map((field) => <PaletteItem key={field.type} field={field} onAdd={onAdd} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function PaletteItem({ field, onAdd }: { field: (typeof fieldTypes)[number]; onAdd: (type: FieldType) => void }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: `palette:${field.type}` });
  return (
    <button ref={setNodeRef} style={{ transform: CSS.Translate.toString(transform) }} {...listeners} {...attributes} onClick={() => onAdd(field.type)} className="flex min-h-16 w-full items-center gap-3 rounded-lg border border-border bg-white/5 p-3 text-left hover:border-primary">
      <field.icon className="h-5 w-5 text-primary" />
      <span><span className="block text-sm font-semibold text-white">{field.label}</span><span className="text-xs text-text-secondary">{field.description}</span></span>
    </button>
  );
}

function FieldPreview({ field }: { field: FormField }) {
  if (field.type === "section_break") return <div className="border-t border-border pt-3"><h3 className="font-semibold text-white">{field.settings.sectionTitle || field.label}</h3><p className="text-sm text-text-secondary">{field.settings.sectionDescription}</p></div>;
  if (field.type === "rating") return <div className="flex gap-1 text-warning">{Array.from({ length: field.settings.maxRating ?? 5 }).map((_, index) => <span key={index}>★</span>)}</div>;
  if (["multiple_choice", "checkboxes"].includes(field.type)) return <div className="space-y-2">{field.options.map((option) => <div key={option} className="flex items-center gap-2 text-sm text-text-secondary"><span className="h-3 w-3 rounded-full border border-border" />{option}</div>)}</div>;
  return <div className="h-11 rounded-lg border border-border bg-[#111522] px-3 py-3 text-sm text-slate-500">{field.placeholder || "Enter your answer"}</div>;
}

function SortableField({ field, selected, onSelect, onDuplicate, onDelete }: { field: FormField; selected: boolean; onSelect: () => void; onDuplicate: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} onClick={onSelect} className={cn("rounded-lg border bg-surface p-4", selected ? "border-primary bg-primary/10" : "border-border")}>
      <div className="flex items-start gap-3">
        <button className="mt-1 cursor-grab text-text-secondary" {...attributes} {...listeners}><GripVertical className="h-5 w-5" /></button>
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div><h3 className="font-semibold text-white">{field.label} {field.required ? <span className="text-danger">*</span> : null}</h3>{field.helperText ? <p className="text-sm text-text-secondary">{field.helperText}</p> : null}</div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={(event) => { event.stopPropagation(); onDuplicate(); }}><Copy className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" onClick={(event) => { event.stopPropagation(); onDelete(); }}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
          <FieldPreview field={field} />
        </div>
      </div>
    </div>
  );
}

function FieldSettingsPanel({ field, onChange }: { field?: FormField; onChange: (field: FormField) => void }) {
  const [tab, setTab] = useState<"settings" | "validation">("settings");
  if (!field) return <div className="p-4"><EmptyState icon={Settings} title="Select a field" description="Select a field to edit its settings." /></div>;
  const patch = (partial: Partial<FormField>) => onChange({ ...field, ...partial });
  const patchSettings = (settings: Partial<FormField["settings"]>) => onChange({ ...field, settings: { ...field.settings, ...settings } });
  const choice = ["multiple_choice", "checkboxes", "dropdown"].includes(field.type);
  return (
    <div className="h-full overflow-auto p-4">
      <div className="mb-4 grid grid-cols-2 rounded-lg bg-white/5 p-1">
        <button className={cn("min-h-10 rounded text-sm", tab === "settings" && "bg-primary text-white")} onClick={() => setTab("settings")}>Field Settings</button>
        <button className={cn("min-h-10 rounded text-sm", tab === "validation" && "bg-primary text-white")} onClick={() => setTab("validation")}>Validation</button>
      </div>
      {tab === "settings" ? <div className="space-y-4">
        <Input label="Label" value={field.label} onChange={(event) => patch({ label: event.target.value })} required />
        {!["rating", "section_break", "checkboxes"].includes(field.type) ? <Input label="Placeholder" value={field.placeholder ?? ""} onChange={(event) => patch({ placeholder: event.target.value })} /> : null}
        <Input label="Helper text" value={field.helperText ?? ""} onChange={(event) => patch({ helperText: event.target.value })} />
        {field.type !== "section_break" ? <Toggle label="Required" checked={field.required} onChange={(checked) => patch({ required: checked })} /> : null}
        {choice ? <div className="space-y-2"><p className="text-sm font-semibold text-white">Options</p>{field.options.map((option, index) => <div key={`${option}-${index}`} className="flex gap-2"><Input value={option} onChange={(event) => patch({ options: field.options.map((item, itemIndex) => itemIndex === index ? event.target.value : item) })} /><Button variant="ghost" onClick={() => patch({ options: field.options.filter((_, itemIndex) => itemIndex !== index) })}><Trash2 className="h-4 w-4" /></Button></div>)}<Button variant="outline" leftIcon={<Plus className="h-4 w-4" />} onClick={() => patch({ options: [...field.options, `Option ${field.options.length + 1}`] })}>Add option</Button></div> : null}
        {field.type === "rating" ? <><Select label="Max rating" value={String(field.settings.maxRating ?? 5)} onChange={(event) => patchSettings({ maxRating: Number(event.target.value) as 3 | 5 | 10 })} options={[3, 5, 10].map((item) => ({ value: String(item), label: String(item) }))} /><Input label="Min label" value={field.settings.minLabel ?? ""} onChange={(event) => patchSettings({ minLabel: event.target.value })} /><Input label="Max label" value={field.settings.maxLabel ?? ""} onChange={(event) => patchSettings({ maxLabel: event.target.value })} /></> : null}
        {field.type === "number" ? <><Input label="Min value" type="number" value={field.settings.minValue ?? ""} onChange={(event) => patchSettings({ minValue: Number(event.target.value) })} /><Input label="Max value" type="number" value={field.settings.maxValue ?? ""} onChange={(event) => patchSettings({ maxValue: Number(event.target.value) })} /></> : null}
        {field.type === "file_upload" ? <><Select label="Max file size" value={String(field.settings.maxFileSizeMB ?? 5)} onChange={(event) => patchSettings({ maxFileSizeMB: Number(event.target.value) as 1 | 5 | 10 | 25 })} options={[1, 5, 10, 25].map((item) => ({ value: String(item), label: `${item}MB` }))} /><div className="space-y-2 text-sm text-text-secondary">{["image/*", "application/pdf", ".doc,.docx", "*"].map((type) => <label key={type} className="flex items-center gap-2"><input type="checkbox" checked={(field.settings.allowedFileTypes ?? []).includes(type)} onChange={(event) => patchSettings({ allowedFileTypes: event.target.checked ? [...(field.settings.allowedFileTypes ?? []), type] : (field.settings.allowedFileTypes ?? []).filter((item) => item !== type) })} />{type}</label>)}</div></> : null}
        {field.type === "section_break" ? <><Input label="Section title" value={field.settings.sectionTitle ?? ""} onChange={(event) => patchSettings({ sectionTitle: event.target.value })} /><Textarea label="Section description" value={field.settings.sectionDescription ?? ""} onChange={(event) => patchSettings({ sectionDescription: event.target.value })} /></> : null}
      </div> : <div className="space-y-4">{["short_text", "long_text"].includes(field.type) ? <><Input label="Min length" type="number" value={field.settings.minLength ?? ""} onChange={(event) => patchSettings({ minLength: Number(event.target.value) })} /><Input label="Max length" type="number" value={field.settings.maxLength ?? ""} onChange={(event) => patchSettings({ maxLength: Number(event.target.value) })} /><Input label="Custom error message" value={field.settings.customErrorMessage ?? ""} onChange={(event) => patchSettings({ customErrorMessage: event.target.value })} /></> : <p className="text-sm text-text-secondary">Validation settings are available for text fields only.</p>}</div>}
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
  const [qr, setQr] = useState("");
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const selected = form.fields.find((field) => field.id === selectedId);
  const publicUrl = `${typeof window === "undefined" ? "" : window.location.origin}/f/${form.slug}`;

  const save = useCallback(async (next: FormDocumentShape) => {
    setForm(next);
    await fetch(`/api/forms/${next._id}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ title: next.title, description: next.description, fields: next.fields, settings: next.settings, status: next.status }) });
  }, []);

  useEffect(() => { if (shareOpen) QRCode.toDataURL(publicUrl).then(setQr).catch(() => setQr("")); }, [shareOpen, publicUrl]);

  function addField(type: FieldType) {
    const field = createDefaultField(type);
    void save({ ...form, fields: [...form.fields, field] });
    setSelectedId(field.id);
    setMobileTab("canvas");
  }
  function updateField(field: FormField) { void save({ ...form, fields: form.fields.map((item) => item.id === field.id ? field : item) }); }
  function duplicateField(field: FormField) { const copy = { ...field, id: crypto.randomUUID(), label: `${field.label} copy` }; const index = form.fields.findIndex((item) => item.id === field.id); void save({ ...form, fields: [...form.fields.slice(0, index + 1), copy, ...form.fields.slice(index + 1)] }); }
  function removeField() { if (!deleteId) return; void save({ ...form, fields: form.fields.filter((field) => field.id !== deleteId) }); setDeleteId(null); }
  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    if (activeId.startsWith("palette:")) addField(activeId.replace("palette:", "") as FieldType);
    else if (active.id !== over.id) {
      const oldIndex = form.fields.findIndex((field) => field.id === active.id);
      const newIndex = form.fields.findIndex((field) => field.id === over.id);
      void save({ ...form, fields: arrayMove(form.fields, oldIndex, newIndex) });
    }
  }
  function updateSettings(settings: FormSettings) { void save({ ...form, settings }); }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <div className="flex h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-lg border border-border bg-[#0c0f16]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface p-3">
          <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} onBlur={() => save(form)} className="w-72" />
          <Badge variant={form.status === "active" ? "success" : form.status === "closed" ? "danger" : "neutral"}>{form.status}</Badge>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => window.open(`/f/${form.slug}`, "_blank")}>Preview</Button>
            <Button variant="outline" leftIcon={<Share2 className="h-4 w-4" />} onClick={() => setShareOpen(true)}>Share</Button>
            <Button variant="outline" leftIcon={<Settings className="h-4 w-4" />} onClick={() => setSettingsOpen(true)}>Form Settings</Button>
            <Button leftIcon={<Save className="h-4 w-4" />} onClick={() => { void save(form); toast.success("Saved"); }}>Save</Button>
            <Button leftIcon={<Check className="h-4 w-4" />} onClick={() => setPublishOpen(true)}>Publish</Button>
          </div>
        </div>
        <div className="grid flex-1 overflow-hidden md:grid-cols-[240px_1fr_320px]">
          <section className={cn("border-r border-border md:block", mobileTab !== "palette" && "hidden")}><FieldPalette onAdd={addField} /></section>
          <section className={cn("overflow-auto p-4 md:block", mobileTab !== "canvas" && "hidden")}>
            <SortableContext items={form.fields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
              <div className="mx-auto max-w-3xl space-y-3">
                {form.fields.length ? form.fields.map((field) => <SortableField key={field.id} field={field} selected={selectedId === field.id} onSelect={() => setSelectedId(field.id)} onDuplicate={() => duplicateField(field)} onDelete={() => setDeleteId(field.id)} />) : <EmptyState icon={FileText} title="Drag fields here to build your form" description="Use the palette to add questions, sections, uploads, ratings, and choices." />}
              </div>
            </SortableContext>
          </section>
          <section className={cn("border-l border-border md:block", mobileTab !== "settings" && "hidden")}><FieldSettingsPanel field={selected} onChange={updateField} /></section>
        </div>
        <div className="grid grid-cols-3 border-t border-border bg-surface md:hidden">{(["palette", "canvas", "settings"] as const).map((tab) => <button key={tab} className={cn("min-h-12 capitalize text-text-secondary", mobileTab === tab && "text-primary")} onClick={() => setMobileTab(tab)}>{tab}</button>)}</div>
      </div>
      <ConfirmModal isOpen={Boolean(deleteId)} title="Delete field" message="Remove this field from the form canvas?" confirmLabel="Delete" confirmVariant="danger" onConfirm={removeField} onCancel={() => setDeleteId(null)} />
      <ConfirmModal isOpen={publishOpen} title="Publish form" message="Make this form public and ready to accept responses." confirmLabel="Publish" onConfirm={() => { void save({ ...form, status: "active" }); setPublishOpen(false); }} onCancel={() => setPublishOpen(false)} />
      <Modal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} title="Form Settings" size="lg"><div className="grid gap-4 md:grid-cols-2"><Input label="Form title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /><Textarea label="Description" value={form.description ?? ""} onChange={(event) => setForm({ ...form, description: event.target.value })} /><Input label="Submit button label" value={form.settings.submitButtonLabel} onChange={(event) => updateSettings({ ...form.settings, submitButtonLabel: event.target.value })} /><Textarea label="Thank you message" value={form.settings.thankYouMessage} onChange={(event) => updateSettings({ ...form.settings, thankYouMessage: event.target.value })} /><Input label="Redirect URL" value={form.settings.redirectUrl ?? ""} onChange={(event) => updateSettings({ ...form.settings, redirectUrl: event.target.value })} /><Select label="Display mode" value={form.settings.displayMode} onChange={(event) => updateSettings({ ...form.settings, displayMode: event.target.value as "classic" | "conversational" })} options={[{ value: "classic", label: "Classic" }, { value: "conversational", label: "Conversational" }]} /><div><p className="mb-2 text-sm font-semibold">Primary color</p><ColorPicker value={form.settings.theme.primaryColor} onChange={(value) => updateSettings({ ...form.settings, theme: { ...form.settings.theme, primaryColor: value } })} /></div><div><p className="mb-2 text-sm font-semibold">Background color</p><ColorPicker value={form.settings.theme.backgroundColor} onChange={(value) => updateSettings({ ...form.settings, theme: { ...form.settings.theme, backgroundColor: value } })} /></div><Input label="Notification email" value={form.settings.notifications.notificationEmail ?? ""} onChange={(event) => updateSettings({ ...form.settings, notifications: { ...form.settings.notifications, notificationEmail: event.target.value } })} /></div></Modal>
      <Modal isOpen={shareOpen} onClose={() => setShareOpen(false)} title="Share Form"><div className="space-y-4"><Input label="Public link" value={publicUrl} readOnly /><Button leftIcon={<Copy className="h-4 w-4" />} onClick={() => navigator.clipboard.writeText(publicUrl)}>Copy link</Button><Textarea label="Embed code" readOnly value={`<iframe src="${publicUrl}" style="width:100%;border:0;min-height:640px" loading="lazy"></iframe>`} />{qr ? <img src={qr} alt="QR code" className="h-48 w-48 rounded bg-white p-3" /> : null}<Link className="text-sm text-indigo-300" href={qr} download="formcraft-qr.png">Download as PNG</Link></div></Modal>
    </DndContext>
  );
}
