"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Bell, Menu, Settings, User } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/Button";
import { initials } from "@/lib/utils";

export function TopBar({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const { data } = useSession();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-white md:text-xl">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-danger" />
        </Button>
        <div className="group relative">
          <button className="flex min-h-11 items-center gap-2 rounded-lg px-2 hover:bg-white/5" aria-label="User menu">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/20 text-xs font-bold text-indigo-200">{initials(data?.user?.name)}</span>
          </button>
          <div className="invisible absolute right-0 top-11 w-52 rounded-lg border border-border bg-surface p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
            <div className="px-3 py-2">
              <p className="text-sm font-semibold text-white">{data?.user?.name ?? "Demo User"}</p>
              <p className="truncate text-xs text-text-secondary">{data?.user?.email ?? "demo@formcraft.test"}</p>
            </div>
            <Button variant="ghost" fullWidth leftIcon={<User className="h-4 w-4" />}>Profile</Button>
            <Button variant="ghost" fullWidth leftIcon={<Settings className="h-4 w-4" />}>Settings</Button>
            <Button variant="ghost" fullWidth onClick={() => signOut({ callbackUrl: "/login" })}>Sign out</Button>
          </div>
        </div>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 bg-black/60 md:hidden" onClick={() => setOpen(false)}>
          <div className="h-full w-72" onClick={(event) => event.stopPropagation()}>
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </header>
  );
}
