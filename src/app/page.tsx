import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, ClipboardList, Code2, FileText, Lock, MousePointer2, Sparkles } from "lucide-react";
import { FormCraftScene } from "@/components/home/FormCraftScene";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "FormCraft | No-Code Form Builder for High-Converting Forms",
  description:
    "Build beautiful online forms, collect responses, analyze submissions, and embed branded forms anywhere with FormCraft's no-code form builder.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FormCraft | No-Code Form Builder",
    description: "Create online forms, surveys, applications, and lead forms with a fast no-code builder.",
    url: "/",
    siteName: "FormCraft",
    type: "website",
  },
  keywords: [
    "no-code form builder",
    "online form builder",
    "Typeform alternative",
    "Jotform alternative",
    "survey builder",
    "lead capture forms",
    "form analytics",
  ],
};

const features = [
  {
    title: "Drag-and-drop builder",
    description: "Create contact forms, applications, surveys, event registrations, and file upload flows without writing code.",
    icon: MousePointer2,
  },
  {
    title: "Classic and conversational forms",
    description: "Publish traditional full-page forms or one-question-at-a-time experiences that feel polished on mobile.",
    icon: ClipboardList,
  },
  {
    title: "Responses and analytics",
    description: "Review submissions, export CSVs, inspect individual answers, and understand response patterns by question type.",
    icon: BarChart3,
  },
  {
    title: "Embeds and sharing",
    description: "Share public links, copy iframe embeds, generate QR codes, and keep forms branded with custom themes.",
    icon: Code2,
  },
];

const useCases = ["Lead generation", "Customer feedback", "Job applications", "Event registration", "Intake forms", "Research surveys"];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "FormCraft",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: "No-code online form builder for creating, publishing, embedding, and analyzing high-converting forms.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="flex items-center gap-3 text-xl font-bold text-white" aria-label="FormCraft home">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-white">F</span>
            FormCraft
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-text-secondary md:flex" aria-label="Primary navigation">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#use-cases" className="hover:text-white">Use cases</a>
            <a href="#seo" className="hover:text-white">Why FormCraft</a>
            <Link href="/login" className="hover:text-white">Log in</Link>
          </nav>
          <Link href="/register">
            <Button rightIcon={<ArrowRight className="h-4 w-4" />}>Start free</Button>
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-[1fr_560px] md:px-6">
          <div className="relative z-10">
            <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl">
              Build online forms that people actually finish
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
              FormCraft is a no-code form builder for teams that need fast creation, beautiful public forms, response management, analytics, and embeddable workflows.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register">
                <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>Create a form</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">Open dashboard</Button>
              </Link>
            </div>
            <div className="mt-8 grid gap-3 text-sm text-text-secondary sm:grid-cols-3">
              {["No-code builder", "Mobile-ready forms", "Analytics included"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="relative h-[420px] overflow-hidden rounded-lg border border-border bg-[#111522] shadow-[0_30px_120px_rgba(99,102,241,0.18)] md:h-[540px]">
            <FormCraftScene />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#111522] to-transparent p-5">
              <Card padding="sm" className="bg-background/85 backdrop-blur">
                <p className="text-sm font-semibold text-white">Live form builder preview</p>
                <p className="mt-1 text-xs text-text-secondary">Three.js powered product visual with code-native app UI around it.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-border bg-[#111522] py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-white">Everything you need to publish better forms</h2>
            <p className="mt-3 text-text-secondary">FormCraft combines form creation, distribution, submissions, and analytics in one production-ready workspace.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} hover>
                <feature.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-5 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-text-secondary">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="use-cases" className="py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[0.85fr_1.15fr] md:px-6">
          <div>
            <h2 className="text-3xl font-bold text-white">A form builder for real business workflows</h2>
            <p className="mt-4 leading-7 text-text-secondary">
              Launch forms for marketing, operations, hiring, support, and research. Start from templates or build every field from scratch.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {useCases.map((useCase) => (
              <div key={useCase} className="flex min-h-16 items-center gap-3 rounded-lg border border-border bg-surface p-4">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-medium text-white">{useCase}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="seo" className="border-y border-border bg-[#111522] py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-3 md:px-6">
          <Card>
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="mt-5 text-xl font-semibold text-white">SEO-ready public pages</h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">The homepage ships with metadata, canonical URL, Open Graph content, structured data, and crawlable product copy.</p>
          </Card>
          <Card>
            <Lock className="h-6 w-6 text-primary" />
            <h2 className="mt-5 text-xl font-semibold text-white">Safe without database env</h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">The public homepage does not connect to MongoDB, so Vercel can build and serve it even before database credentials are added.</p>
          </Card>
          <Card>
            <BarChart3 className="h-6 w-6 text-primary" />
            <h2 className="mt-5 text-xl font-semibold text-white">Built for conversion</h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">Clear above-the-fold messaging, direct calls to action, internal links, and product-specific language support search and signup intent.</p>
          </Card>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <h2 className="text-3xl font-bold text-white">Create your first online form today</h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">Use FormCraft to build lead forms, surveys, applications, and intake workflows with a polished no-code builder.</p>
          <div className="mt-8">
            <Link href="/register">
              <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>Start building free</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
