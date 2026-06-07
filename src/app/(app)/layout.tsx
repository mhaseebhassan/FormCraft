import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { authOptions } from "@/lib/auth";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div className="fixed bottom-0 left-0 top-0 hidden md:block">
        <Sidebar />
      </div>
      <div className="md:pl-60">
        <TopBar title="FormCraft" />
        <main className="min-h-[calc(100vh-4rem)] px-4 py-6 pb-24 md:px-6 md:pb-8">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
