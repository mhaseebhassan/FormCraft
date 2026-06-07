import { notFound } from "next/navigation";
import { BuilderClient } from "@/components/builder/BuilderClient";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { serialize } from "@/lib/api";
import { Form } from "@/models/Form";
import { getServerSession } from "next-auth";
import type { FormDocumentShape } from "@/types";

interface PageProps {
  params: Promise<{ formId: string }>;
}

export default async function BuilderPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  await connectToDatabase();
  const { formId } = await params;
  const form = await Form.findOne({ _id: formId, userId: session?.user.id }).lean();
  if (!form) notFound();
  return <BuilderClient initialForm={serialize<FormDocumentShape>(form)} />;
}
