"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  CheckCircle2,
  Clock3,
  FileSpreadsheet,
  FileText,
  Layers,
  Layout,
  MessageSquare,
  MoveUpRight,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const journey = [
  {
    number: "01",
    icon: Layout,
    title: "Compose with fluidity",
    text: "Drag, drop, and configure 15+ input types with instant validation, conditional branch logic, and customizable styling.",
  },
  {
    number: "02",
    icon: Zap,
    title: "Publish instantly",
    text: "Generate shareable links, conversational one-question-at-a-time flows, QR codes, or headless embed scripts in one click.",
  },
  {
    number: "03",
    icon: MessageSquare,
    title: "Stream responses live",
    text: "Watch submissions flow in real-time with zero polling lag via MongoDB change-streams and SSE reactive sockets.",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Extract real clarity",
    text: "Inspect conversion funnels, response velocity, question drop-off rates, and export clean CSV datasets on demand.",
  },
];

function MarketingVisual() {
  return (
    <div className="relative mx-auto min-h-[460px] w-full max-w-[560px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#161616] p-6 shadow-[0_36px_90px_-55px_rgba(0,0,0,0.8)] sm:p-8">
      {/* Decorative concentric arcs */}
      <div className="pointer-events-none absolute -right-20 -top-28 size-[340px] rounded-full border-[28px] border-white/[0.03]" />
      <div className="pointer-events-none absolute -left-12 bottom-4 size-44 rounded-full border border-violet-500/10" />
      <span className="absolute right-[22%] top-[20%] size-2.5 rounded-full bg-violet-400 shadow-[0_0_12px_#a78bfa]" />

      {/* Header bar */}
      <div className="relative flex items-center justify-between text-xs">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          formcraft / studio engine
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          seeded workspace
        </span>
      </div>

      {/* Main card headline */}
      <div className="relative mt-8 max-w-[340px]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-400">
          Conversational Flow Engine
        </p>
        <h2 className="mt-2 font-heading text-3xl font-bold leading-tight tracking-[-0.06em] text-neutral-100 sm:text-4xl">
          High completion rates without form fatigue.
        </h2>
      </div>

      {/* Embedded interactive form mockup */}
      <div className="relative mt-8 ml-auto w-full sm:w-[86%] rounded-2xl border border-white/[0.12] bg-[#1c1c1c]/95 p-5 shadow-[0_18px_50px_-34px_rgba(0,0,0,0.7)] backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-xl bg-violet-500/20 font-mono text-xs font-bold text-violet-300 border border-violet-500/30">
              Q1
            </span>
            <div>
              <p className="text-xs font-semibold text-neutral-200">
                Product Experience Survey
              </p>
              <p className="text-[10px] text-neutral-400">Step 1 of 4 · 25% completed</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            4.9 / 5.0
          </span>
        </div>

        <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-neutral-300">
              How would you rate the studio UI responsiveness?
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                className={`grid size-7 place-items-center rounded-lg border text-xs font-bold ${
                  num === 5
                    ? "border-violet-500 bg-violet-500/20 text-violet-200 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                    : "border-white/10 bg-white/[0.02] text-neutral-400"
                }`}
              >
                {num}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-400">
            <CheckCircle2 className="size-3.5 text-emerald-400" />
            Auto-saves locally
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-violet-400">
            Press Enter ↵
          </span>
        </div>
      </div>

      {/* Feature tick line */}
      <div className="relative mt-6 flex flex-wrap items-center gap-3 text-[11px] font-medium text-neutral-400">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-violet-400" />
          Real-time validation
        </span>
        <span className="h-px w-6 bg-white/10" />
        <span className="flex items-center gap-1.5">
          <Clock3 className="size-3.5 text-violet-400" />
          Sub-50ms latency
        </span>
      </div>
    </div>
  );
}

export default function HomeClient() {
  const { status } = useSession();
  const isSignedIn = status === "authenticated";

  return (
    <div className="min-h-screen bg-background text-neutral-100">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#111111]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="transition hover:opacity-90">
            <BrandMark />
          </Link>
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="inline-flex h-9 items-center gap-2 rounded-xl bg-neutral-100 px-4 text-xs font-semibold text-neutral-900 transition hover:bg-neutral-200"
              >
                Open Dashboard
                <ArrowRight className="size-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-neutral-100 px-4 text-xs font-semibold text-neutral-900 transition hover:bg-neutral-200"
                >
                  Explore Demo
                  <ArrowRight className="size-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/[0.08]">
        {/* Wireframe background rings */}
        <div className="pointer-events-none absolute -left-48 -top-52 size-[36rem] rounded-full border border-white/[0.06]" />
        <div className="pointer-events-none absolute -right-44 top-16 size-[32rem] rounded-full border border-orange-500/10" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-12 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-10">
          <div className="relative z-10 max-w-xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-400">
              High-Conversion Form Architecture
            </p>
            <h1 className="mt-5 font-heading text-[3.2rem] font-bold leading-[0.94] tracking-[-0.08em] text-neutral-100 sm:text-6xl lg:text-[4.75rem]">
              Forms engineered for real answers.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-neutral-400 sm:text-lg sm:leading-8">
              FormCraft unites a drag-and-drop studio, live response streaming, and conversational presentation to turn passive viewers into engaged respondents.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-neutral-100 px-5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200 shadow-[0_10px_25px_-10px_rgba(255,255,255,0.4)]"
              >
                Launch Seeded Workspace
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/forms"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 text-sm font-medium text-neutral-200 transition hover:bg-white/[0.08] hover:text-white"
              >
                Explore 10 Forms
                <ArrowUpRight className="size-4" />
              </Link>
            </div>

            <div className="mt-10 grid gap-3 border-t border-white/[0.08] pt-6 text-xs text-neutral-400 sm:grid-cols-3">
              <span className="flex items-center gap-2">
                <Check className="size-3.5 text-violet-400" />
                Local MongoDB active
              </span>
              <span className="flex items-center gap-2">
                <Check className="size-3.5 text-violet-400" />
                Live response stream
              </span>
              <span className="flex items-center gap-2">
                <Check className="size-3.5 text-violet-400" />
                Zero external lock-in
              </span>
            </div>
          </div>

          <MarketingVisual />
        </div>
      </section>

      {/* 4-Step Journey Section */}
      <section className="border-b border-white/[0.08] bg-[#141414]/50">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-400">
              The Product Engine
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-[-0.06em] text-neutral-100 sm:text-4xl">
              From blank canvas to hundreds of verified answers.
            </h2>
            <p className="mt-4 text-base leading-7 text-neutral-400">
              Designed to eliminate friction at every stage of the data collection lifecycle.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {journey.map(({ number, icon: Icon, title, text }) => (
              <SpotlightCard
                key={number}
                tint="violet"
                className="p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                    <Icon className="size-5 text-violet-400" />
                    <span className="font-mono text-xs font-semibold text-neutral-400">
                      {number}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-bold tracking-[-0.04em] text-neutral-100">
                    {title}
                  </h3>
                  <p className="mt-2.5 text-xs leading-6 text-neutral-400">
                    {text}
                  </p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Two-Column Audience Section */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Creator card */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#171717] p-8 sm:p-10">
            <div className="flex items-center gap-3 border-b border-white/[0.08] pb-6">
              <Layers className="size-5 text-violet-400" />
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-400">
                  For Form Designers & Engineers
                </p>
                <h2 className="mt-1.5 text-2xl font-bold tracking-[-0.05em] text-neutral-100">
                  Total control over layout, logic & schema.
                </h2>
              </div>
            </div>
            <p className="mt-6 text-sm leading-7 text-neutral-400">
              Build intricate multi-page application forms, surveys, and intake flows with granular field constraints, logic triggers, and custom theming.
            </p>
            <ul className="mt-6 space-y-3 text-xs text-neutral-300">
              {[
                "15+ battle-tested field components with rich input modes",
                "Conditional branching and dynamic question display rules",
                "Real-time SSE event pipeline with auto-updating analytics",
                "One-click CSV exports and schema validation via Zod",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-violet-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-neutral-200 transition hover:bg-white/[0.08]"
              >
                Open Builder Studio
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Respondent card */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#1a1a1a] p-8 sm:p-10">
            <div className="flex items-center gap-3 border-b border-white/[0.08] pb-6">
              <Zap className="size-5 text-orange-400" />
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-400">
                  For Your Respondents
                </p>
                <h2 className="mt-1.5 text-2xl font-bold tracking-[-0.05em] text-neutral-100">
                  Zero friction, beautiful animations, instant flow.
                </h2>
              </div>
            </div>
            <p className="mt-6 text-sm leading-7 text-neutral-400">
              Respondents breeze through one question at a time with keyboard shortcuts (Enter / Tab), auto-scrolling, mobile touch gestures, and clear progress states.
            </p>
            <ul className="mt-6 space-y-3 text-xs text-neutral-300">
              {[
                "Conversational mode for immersive single-question focus",
                "Instant client-side feedback and friendly error messages",
                "Full keyboard navigation without touching the trackpad",
                "Sub-second load times on mobile, desktop, and tablet",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-orange-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                href="/forms"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-neutral-200 transition hover:bg-white/[0.08]"
              >
                Test a Live Form
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Outcome / Testimonial Spotlight Section */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-400">
              Real Conversion Impact
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-[-0.06em] text-neutral-100 sm:text-5xl">
              Elevate completion rates by 34% or more.
            </h2>
            <p className="mt-5 text-sm leading-7 text-neutral-400">
              When questions feel thoughtful, focused, and responsive, participants finish what they start.
            </p>
          </div>

          <SpotlightCard
            tint="coral"
            className="border-orange-500/20 bg-[#1c1816] p-7 sm:p-9"
          >
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-orange-500/20 font-bold text-orange-300">
                SC
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-100">Sarah Chen</p>
                <p className="text-xs text-neutral-400">VP Product & Growth · CloudScale</p>
              </div>
            </div>
            <div className="mt-6 flex gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-amber-400" />
              ))}
            </div>
            <blockquote className="mt-5 font-heading text-xl font-medium leading-snug tracking-[-0.03em] text-neutral-200 sm:text-2xl">
              “FormCraft gave our user feedback surveys the same polish and fluidity as our production app. Our completion rate jumped from 14% to 48% within two weeks.”
            </blockquote>
            <div className="mt-6 border-t border-white/[0.08] pt-4 text-xs font-mono text-neutral-400">
              Customer Onboarding Survey · 4.8 min avg time · 92% completion
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* Dark Tactile CTA Banner */}
      <section className="mx-5 mb-20 overflow-hidden rounded-2xl border border-white/[0.1] bg-[#141414] sm:mx-8 lg:mx-10">
        <div className="relative mx-auto max-w-7xl px-6 py-14 sm:px-10 sm:py-20">
          <div className="pointer-events-none absolute -right-10 -top-28 size-80 rounded-full border-[28px] border-white/[0.03]" />
          <div className="relative max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-400">
              Get Started Now
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-[-0.06em] text-white sm:text-5xl">
              Experience the full product flow.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-neutral-400 sm:text-base">
              Explore the seeded workspace, browse 10 production forms, test the live builder, and inspect real-time response analytics.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200"
              >
                Open Demo Dashboard
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/forms"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-transparent px-5 text-sm font-medium text-white transition hover:bg-white/[0.06]"
              >
                Browse Forms Library
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
