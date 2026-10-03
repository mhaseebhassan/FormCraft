"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Bell, ChevronDown, Menu, Settings, Sparkles, User, ExternalLink } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { initials } from "@/lib/utils";

const notifications = [
  {
    id: "notif-1",
    title: "New response received",
    detail: "Customer Satisfaction Survey #14 received from Alex Chen",
    time: "2m ago",
    unread: true,
  },
  {
    id: "notif-2",
    title: "Conversion threshold passed",
    detail: "Tech Conference RSVP reached 32.5% completion rate",
    time: "45m ago",
    unread: true,
  },
  {
    id: "notif-3",
    title: "Workspace seeded",
    detail: "10 forms and 200+ demo responses loaded successfully",
    time: "2h ago",
    unread: false,
  },
];

export function TopBar({ title }: { title: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const { data } = useSession();

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.08] bg-[#111111]/80 px-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3">
        <button
          className="flex size-9 items-center justify-center rounded-xl border border-white/10 text-neutral-400 hover:text-white md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="size-4" />
        </button>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono text-neutral-400">formcraft</span>
          <span className="text-neutral-400">/</span>
          <span className="font-medium text-neutral-200">{title}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick link to live public form demo */}
        <Link
          href="/forms"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-white/[0.08] hover:text-white"
        >
          <Sparkles className="size-3.5 text-violet-400" />
          <span>Form Studio</span>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setUserOpen(false);
            }}
            className="relative flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-neutral-400 transition hover:bg-white/[0.08] hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_#a78bfa]" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 w-80 rounded-2xl border border-white/10 bg-[#171717] p-3 shadow-2xl z-50 animate-in fade-in-0 duration-200">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5 px-1">
                <span className="text-xs font-semibold text-neutral-200">Notifications</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-neutral-400">
                  {unreadCount} new
                </span>
              </div>
              <div className="mt-2 space-y-1.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex flex-col gap-1 rounded-xl p-2.5 transition hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-neutral-200">{n.title}</span>
                      <span className="font-mono text-[10px] text-neutral-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">{n.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setUserOpen(!userOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-1.5 pr-3 transition hover:bg-white/[0.08]"
            aria-label="User menu"
          >
            <span className="grid size-6 place-items-center rounded-lg bg-violet-500/20 font-mono text-[10px] font-bold text-violet-200">
              {initials(data?.user?.name)}
            </span>
            <span className="hidden sm:inline text-xs font-medium text-neutral-200">
              {data?.user?.name?.split(" ")[0] ?? "Demo User"}
            </span>
            <ChevronDown className="size-3 text-neutral-400" />
          </button>

          {userOpen && (
            <div className="absolute right-0 top-11 w-56 rounded-2xl border border-white/10 bg-[#171717] p-2 shadow-2xl z-50 animate-in fade-in-0 duration-200">
              <div className="border-b border-white/[0.08] px-3 py-2">
                <p className="text-xs font-semibold text-neutral-100">{data?.user?.name ?? "Demo User"}</p>
                <p className="truncate font-mono text-[10px] text-neutral-400">
                  {data?.user?.email ?? "demo@formcraft.test"}
                </p>
              </div>
              <div className="mt-1 space-y-0.5">
                <Link
                  href="/settings"
                  onClick={() => setUserOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-neutral-300 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <User className="size-3.5" />
                  <span>Profile details</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setUserOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-neutral-300 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <Settings className="size-3.5" />
                  <span>Workspace settings</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-rose-300 transition hover:bg-rose-500/10 cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="h-full w-64" onClick={(e) => e.stopPropagation()}>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}
