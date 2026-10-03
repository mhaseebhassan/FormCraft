import { notFound } from "next/navigation";
import { PublicFormClient } from "@/components/renderer/PublicFormClient";
import { serialize } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { Form } from "@/models/Form";
import { demoStore } from "@/lib/demo-data";
import type { FormDocumentShape } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const demoForm = demoStore.getFormBySlug(slug) || demoStore.getFormById(slug);
  if (demoForm) {
    return { title: `${demoForm.title} | FCraft` };
  }
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const form = await Form.findOne({ slug }).select("title").lean();
      if (form) return { title: `${form.title} | FCraft` };
    }
  } catch {
    // fallback
  }
  return { title: "Form | FCraft" };
}

export default async function PublicFormPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Check demoStore first (supports slugs: sQaJUY4L, UtE8efQe, XgXbRbLO)
  const demoForm = demoStore.getFormBySlug(slug) || demoStore.getFormById(slug);
  if (demoForm) {
    return <PublicFormClient form={demoForm} />;
  }

  // 2. If no MongoDB URI, fall back to the first demo form
  if (!process.env.MONGODB_URI) {
    if (demoStore.forms[0]) {
      return <PublicFormClient form={demoStore.forms[0]} />;
    }
    notFound();
  }

  try {
    await connectToDatabase();
    const form = await Form.findOne({ slug }).lean();
    if (!form) {
      if (demoStore.forms[0]) {
        return <PublicFormClient form={demoStore.forms[0]} />;
      }
      notFound();
    }
    if (form.status === "draft") {
      return (
        <main className="grid min-h-screen place-items-center bg-[#0d0d0d] p-4 text-white">
          <h1 className="text-2xl font-bold">This form is not yet available</h1>
        </main>
      );
    }
    if (form.status === "closed") {
      return (
        <main className="grid min-h-screen place-items-center bg-[#0d0d0d] p-4 text-white">
          <h1 className="text-2xl font-bold">This form is closed and no longer accepting responses</h1>
        </main>
      );
    }
    return <PublicFormClient form={serialize<FormDocumentShape>(form)} />;
  } catch (err) {
    console.warn("Public form DB error, using fallback:", err);
    if (demoStore.forms[0]) {
      return <PublicFormClient form={demoStore.forms[0]} />;
    }
    notFound();
  }
}

