"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, FileText, Inbox, LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/forms", label: "Forms", icon: FileText },
  { href: "/responses", label: "Responses", icon: Inbox },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-border bg-[#111522] md:hidden">
      {tabs.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        const Icon = tab.icon;
        return (
          <Link key={tab.href} href={tab.href} className={cn("flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] text-text-secondary", active && "text-primary")}>
            <Icon className={cn("h-5 w-5 transition", active && "scale-110")} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
