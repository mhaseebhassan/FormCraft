"use client";

import { Suspense, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, CheckCircle2, LockKeyhole, Sparkles, Zap } from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const [email, setEmail] = useState("demo@formcraft.test");
  const [password, setPassword] = useState("FormCraft123!");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState("");


  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const isDemoParam = searchParams.get("demo") === "1";

  // Auto-login if ?demo=1 is present
  useEffect(() => {
    if (isDemoParam) {
      handleDemoLogin();
    }
  }, [isDemoParam]);

  async function handleDemoLogin() {
    setDemoLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: "demo@formcraft.test",
        password: "FormCraft123!",
        callbackUrl,
      });

      if (result?.error) {
        setError("Could not load seeded demo account. Please check local database.");
        return;
      }

      toast.success("Loaded seeded demo workspace!");
      window.location.href = callbackUrl;
    } catch {
      setError("Unexpected error logging into demo account.");
    } finally {
      setDemoLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (result?.error) {
        setError("Invalid email or password credentials.");
        return;
      }

      toast.success("Welcome back to FCraft!");
      window.location.href = callbackUrl;
    } catch {
      setError("An unexpected error occurred while logging in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-8">
      {/* Top Header */}
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="transition hover:opacity-90">
          <BrandMark />
        </Link>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-neutral-400">
          <LockKeyhole className="size-3.5 text-emerald-400" />
          <span>Private local MongoDB workspace</span>
        </div>
      </div>

      {/* Main Grid matching Serveflow login layout */}
      <div className="mx-auto grid min-h-[calc(100vh-120px)] max-w-6xl items-center gap-12 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left Side: Context & Highlights */}
        <div className="max-w-xl">
          <p className="mb-4 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-400">
            <Sparkles className="size-3.5" />
            High-Conversion Form Architecture
          </p>
          <h1 className="font-heading text-4xl font-bold leading-[1.02] tracking-[-0.07em] text-neutral-100 sm:text-6xl">
            Good answers start with the right form.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-neutral-400">
            FCraft helps engineering and product teams build conversational and classic forms, stream responses live, and analyze real question metrics.
          </p>

          <div className="mt-8 grid max-w-md gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.08] bg-[#161616] p-4 shadow-sm">
              <CheckCircle2 className="size-4 text-violet-400" />
              <p className="mt-3 text-xs font-semibold text-neutral-200">10 Seeded Forms</p>
              <p className="mt-1 text-xs leading-5 text-neutral-400">
                Pre-populated surveys, contact forms, and applications.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-[#161616] p-4 shadow-sm">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <p className="mt-3 text-xs font-semibold text-neutral-200">200+ Live Responses</p>
              <p className="mt-1 text-xs leading-5 text-neutral-400">
                Instant analytics and CSV data export ready on disk.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="mx-auto w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#161616] p-7 sm:p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-neutral-100">
              Enter your workspace
            </h2>
            <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed">
              Sign in to manage your forms, inspect responses, and view analytics.
            </p>
          </div>

          {/* 1-Click Load Seeded Demo Action */}
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleDemoLogin}
            loading={demoLoading}
            className="w-full rounded-xl border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-neutral-200 hover:text-white font-medium text-xs justify-center gap-2 h-11"
          >
            <Sparkles className="size-4 text-violet-400" />
            <span>Load Seeded Demo Workspace (1-Click)</span>
          </Button>

          <div className="relative my-6 text-center text-xs">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/[0.08]" />
            </div>
            <span className="relative bg-[#161616] px-3 font-mono text-[10px] uppercase tracking-wider text-neutral-500">
              or sign in with credentials
            </span>
          </div>


          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">Email Address</label>
              <Input
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">Password</label>
              <Input
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </div>

            {error && (
              <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-300">
                {error}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="mt-2 w-full rounded-xl bg-neutral-100 text-neutral-900 hover:bg-neutral-200 font-semibold"
              disabled={loading || demoLoading}
            >
              {loading ? "Opening workspace..." : "Open Workspace"}
              <ArrowRight className="size-4 ml-1.5" />
            </Button>
          </form>

          {/* Clean Google OAuth Button */}
          <div className="mt-4 pt-4 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl })}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-xs font-medium text-neutral-300 transition hover:bg-white/[0.06] hover:text-white cursor-pointer"
            >
              <svg className="size-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <p className="mt-5 text-center text-[11px] leading-5 text-neutral-400">
            Local credentials are prefilled. No external account or payment required.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
          <div className="size-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

