"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, LockKeyhole, Sparkles } from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { registerSchema } from "@/lib/validations";
import type { z } from "zod";

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterValues) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        setError(body.error ?? "Registration failed. Please try again.");
        return;
      }

      await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl: "/dashboard",
      });

      toast.success("Account created successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("An unexpected error occurred during account creation.");
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

      <div className="mx-auto grid min-h-[calc(100vh-120px)] max-w-6xl items-center gap-12 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-xl">
          <p className="mb-4 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-400">
            <Sparkles className="size-3.5" />
            Instant Developer Workspace
          </p>
          <h1 className="font-heading text-4xl font-bold leading-[1.02] tracking-[-0.07em] text-neutral-100 sm:text-6xl">
            Start building forms that convert.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-neutral-400">
            Join FCraft to create fluid, conversational forms with live real-time response ingestion and deep question analytics.
          </p>

          <div className="mt-8 grid max-w-md gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.08] bg-[#161616] p-4 shadow-sm">
              <CheckCircle2 className="size-4 text-violet-400" />
              <p className="mt-3 text-xs font-semibold text-neutral-200">Zero Lock-In</p>
              <p className="mt-1 text-xs leading-5 text-neutral-400">
                Self-hosted MongoDB with complete schema ownership.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-[#161616] p-4 shadow-sm">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <p className="mt-3 text-xs font-semibold text-neutral-200">Full Access</p>
              <p className="mt-1 text-xs leading-5 text-neutral-400">
                Studio canvas, question analytics, and CSV exports.
              </p>
            </div>
          </div>
        </div>

        <SpotlightCard tint="violet" className="mx-auto w-full max-w-md bg-[#161616] p-6 sm:p-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-400">
              Create Account
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-[-0.05em] text-neutral-100">
              Set up your workspace.
            </h2>
            <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-violet-400 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">Full Name</label>
              <Input
                placeholder="Jane Doe"
                error={formState.errors.name?.message}
                {...register("name")}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">Email Address</label>
              <Input
                type="email"
                placeholder="jane@company.com"
                error={formState.errors.email?.message}
                {...register("email")}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">Password</label>
              <Input
                type="password"
                placeholder="At least 8 characters"
                error={formState.errors.password?.message}
                {...register("password")}
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
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
              <ArrowRight className="size-4 ml-1.5" />
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
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
            By signing up, you agree to local terms and privacy guidelines.
          </p>
        </SpotlightCard>
      </div>
    </div>
  );
}
