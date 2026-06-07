import { notFound } from "next/navigation";
import { PublicFormClient } from "@/components/renderer/PublicFormClient";
import { serialize } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { Form } from "@/models/Form";
import type { FormDocumentShape } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  await connectToDatabase();
  const { slug } = await params;
  const form = await Form.findOne({ slug }).select("title").lean();
  return { title: form ? `${form.title} | FormCraft` : "Form not found" };
}

export default async function PublicFormPage({ params }: PageProps) {
  await connectToDatabase();
  const { slug } = await params;
  const form = await Form.findOne({ slug }).lean();
  if (!form) notFound();
  if (form.status === "draft") return <main className="grid min-h-screen place-items-center bg-background p-4 text-white"><h1 className="text-2xl font-bold">This form is not yet available</h1></main>;
  if (form.status === "closed") return <main className="grid min-h-screen place-items-center bg-background p-4 text-white"><h1 className="text-2xl font-bold">This form is closed and no longer accepting responses</h1></main>;
  return <PublicFormClient form={serialize<FormDocumentShape>(form)} />;
}
