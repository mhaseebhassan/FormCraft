import { CheckCircle2, Clock, FileEdit, Archive, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type FormStatus = "active" | "draft" | "archived" | "published" | "closed" | string;

const labels: Record<string, string> = {
  active: "Active",
  published: "Published",
  draft: "Draft",
  archived: "Archived",
  closed: "Closed",
};

const styles: Record<string, string> = {
  active: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  published: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  draft: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  archived: "border-neutral-700 bg-neutral-800 text-neutral-400",
  closed: "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

export function StatusPill({
  status,
  className,
}: {
  status: FormStatus;
  className?: string;
}) {
  const norm = status?.toLowerCase() || "draft";
  const label = labels[norm] || status;
  const style = styles[norm] || styles.draft;

  const Icon =
    norm === "active" || norm === "published"
      ? CheckCircle2
      : norm === "draft"
      ? FileEdit
      : norm === "archived"
      ? Archive
      : AlertCircle;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-[0.02em]",
        style,
        className
      )}
    >
      <Icon className="size-3 shrink-0" />
      {label}
    </span>
  );
}
