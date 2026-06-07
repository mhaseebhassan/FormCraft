"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BarChart2, FileText, Inbox, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn, initials } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/forms", label: "My Forms", icon: FileText },
  { href: "/responses", label: "Responses", icon: Inbox },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { data } = useSession();
  return (
    <aside className="flex h-full w-60 flex-col border-r border-border bg-[#111522] p-4">
      <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-2 text-xl font-bold text-white" onClick={onNavigate}>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-white">F</span>
        FormCraft
      </Link>
      <nav className="flex-1 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate} className={cn("relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-text-secondary transition hover:text-white", active && "text-white")}>
              {active ? <motion.span layoutId="nav-indicator" className="absolute inset-0 rounded-lg bg-primary" /> : null}
              <Icon className="relative h-4 w-4" />
              <span className="relative">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border pt-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/20 text-sm font-bold text-indigo-200">{initials(data?.user?.name)}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{data?.user?.name ?? "Demo User"}</p>
            <p className="truncate text-xs text-text-secondary">{data?.user?.email ?? "demo@formcraft.test"}</p>
          </div>
          <Badge variant="primary">FREE</Badge>
        </div>
        <Button variant="ghost" fullWidth leftIcon={<LogOut className="h-4 w-4" />} onClick={() => signOut({ callbackUrl: "/login" })}>
          Sign out
        </Button>
      </div>
    </aside>
  );
}
