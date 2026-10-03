import { notFound } from "next/navigation";
import { BuilderClient } from "@/components/builder/BuilderClient";
import { requireUserId, serialize } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { Form } from "@/models/Form";
import { demoStore } from "@/lib/demo-data";
import type { FormDocumentShape } from "@/types";

interface PageProps {
  params: Promise<{ formId: string }>;
}

export default async function BuilderPage({ params }: PageProps) {
  const { formId } = await params;
  const demoForm = demoStore.getFormById(formId) || demoStore.getFormBySlug(formId);

  // If no DB configured or demo form requested, return demoForm directly
  if (!process.env.MONGODB_URI || demoForm) {
    if (demoForm) {
      return <BuilderClient initialForm={demoForm} />;
    }
    return <BuilderClient initialForm={demoStore.forms[0]} />;
  }

  try {
    const userId = await requireUserId();
    if (!userId) {
      return <BuilderClient initialForm={demoStore.forms[0]} />;
    }

    await connectToDatabase();
    const form = await Form.findOne({ _id: formId, userId }).lean();
    if (!form) {
      if (demoStore.forms[0]) {
        return <BuilderClient initialForm={demoStore.forms[0]} />;
      }
      notFound();
    }
    return <BuilderClient initialForm={serialize<FormDocumentShape>(form)} />;
  } catch (err) {
    console.warn("BuilderPage database lookup failed, using demo fallback:", err);
    if (demoForm || demoStore.forms[0]) {
      return <BuilderClient initialForm={demoForm || demoStore.forms[0]} />;
    }
    notFound();
  }
}

