"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Calendar,
  Compass,
  FileSpreadsheet,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { cn, initials } from "@/lib/utils";

const workspaceLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/forms", label: "Forms Library", icon: FileText },
  { href: "/responses", label: "Responses", icon: Inbox },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

const operateLinks = [
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { data } = useSession();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-white/[0.08] bg-[#141414]/95 px-4 py-5 backdrop-blur-xl">
      {/* Brand Header */}
      <Link
        href="/dashboard"
        className="mb-8 px-2 block transition hover:opacity-90"
        onClick={onNavigate}
      >
        <BrandMark />
      </Link>

      {/* Navigation Sections */}
      <nav className="flex-1 space-y-6" aria-label="Primary navigation">
        <div>
          <p className="mb-2.5 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
            Workspace
          </p>
          <div className="space-y-1">
            {workspaceLinks.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href ||
                (href !== "/dashboard" && pathname.startsWith(`${href}/`));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-white/[0.12] text-white shadow-[0_10px_20px_-18px_rgba(255,255,255,0.4)]"
                      : "text-neutral-400 hover:bg-white/[0.05] hover:text-neutral-200"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4 shrink-0 transition-colors",
                      active ? "text-violet-400" : "text-neutral-400 group-hover:text-white"
                    )}
                  />
                  <span>{label}</span>
                  {label === "Forms Library" && (
                    <span className="ml-auto rounded-md bg-white/[0.08] px-1.5 py-0.5 font-mono text-[10px] font-medium text-neutral-300">
                      10
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2.5 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
            Operate
          </p>
          <div className="space-y-1">
            {operateLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-white/[0.12] text-white shadow-[0_10px_20px_-18px_rgba(255,255,255,0.4)]"
                      : "text-neutral-400 hover:bg-white/[0.05] hover:text-neutral-200"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4 shrink-0 transition-colors",
                      active ? "text-violet-400" : "text-neutral-400 group-hover:text-white"
                    )}
                  />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Local Workspace Status Card (Serveflow pattern) */}
      <div className="mt-auto mb-4 rounded-2xl border border-white/[0.08] bg-[#1a1a1a] p-4 shadow-[0_14px_34px_-28px_rgba(0,0,0,0.7)]">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
          <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          <span>Local MongoDB active</span>
        </div>
        <p className="mt-2 text-xs leading-5 text-neutral-400">
          Zero external keys required. 10 forms and 200+ submissions populated.
        </p>
        <Link
          href="/forms"
          className="mt-3 inline-flex text-xs font-semibold text-violet-400 hover:underline"
        >
          View all forms →
        </Link>
      </div>

      {/* User Section */}
      <div className="border-t border-white/[0.08] pt-3.5">
        <div className="mb-3 flex items-center gap-3 px-1">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-violet-500/15 font-mono text-xs font-bold text-violet-200 border border-violet-500/30">
            {initials(data?.user?.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-neutral-100">
              {data?.user?.name ?? "Demo User"}
            </p>
            <p className="truncate font-mono text-[10px] text-neutral-400">
              {data?.user?.email ?? "demo@formcraft.test"}
            </p>
          </div>
        </div>
        <button
          className="flex h-8.5 w-full items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] text-xs font-medium text-neutral-400 transition hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-300 cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="size-3.5" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
