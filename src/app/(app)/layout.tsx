import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-background text-neutral-100">
      <div className="fixed bottom-0 left-0 top-0 hidden md:block w-64 z-30">
        <Sidebar />
      </div>
      <div className="md:pl-64">
        <TopBar title="FormCraft" />
        <main className="min-h-[calc(100vh-4rem)] px-4 py-8 pb-24 md:px-8 md:pb-12">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
