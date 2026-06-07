import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-background p-4 text-center"><div><h1 className="text-3xl font-bold text-white">Page not found</h1><p className="mt-2 text-text-secondary">The form or page you requested does not exist.</p><Link href="/dashboard"><Button className="mt-5">Go to dashboard</Button></Link></div></main>;
}
