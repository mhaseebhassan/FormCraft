import { createDefaultField } from "@/lib/defaults";
import type { FormField } from "@/types";

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
}

export const formTemplates: FormTemplate[] = [
  {
    id: "contact",
    name: "Contact Form",
    description: "Collect leads and support messages.",
    fields: [
      { ...createDefaultField("short_text"), label: "Name", required: true },
      { ...createDefaultField("email"), label: "Email", required: true },
      { ...createDefaultField("phone"), label: "Phone", required: false },
      { ...createDefaultField("short_text"), label: "Subject", required: true },
      { ...createDefaultField("long_text"), label: "Message", required: true },
    ],
  },
  {
    id: "job",
    name: "Job Application",
    description: "Screen candidates with structured questions.",
    fields: [
      { ...createDefaultField("short_text"), label: "Full Name", required: true },
      { ...createDefaultField("email"), label: "Email", required: true },
      { ...createDefaultField("phone"), label: "Phone", required: true },
      {
        ...createDefaultField("dropdown"),
        label: "Position Applied For",
        required: true,
        options: ["Designer", "Engineer", "Product Manager", "Marketing", "Operations"],
      },
      {
        ...createDefaultField("number"),
        label: "Years of Experience",
        required: true,
        settings: { minValue: 0, maxValue: 50 },
      },
      { ...createDefaultField("long_text"), label: "Cover Letter", required: true },
      {
        ...createDefaultField("file_upload"),
        label: "Resume",
        required: true,
        settings: { allowedFileTypes: ["application/pdf"], maxFileSizeMB: 5 },
      },
    ],
  },
  {
    id: "feedback",
    name: "Feedback Survey",
    description: "Measure satisfaction and gather open feedback.",
    fields: [
      { ...createDefaultField("rating"), label: "Overall Satisfaction", required: true },
      { ...createDefaultField("long_text"), label: "What did you like?", required: false },
      { ...createDefaultField("long_text"), label: "What could be improved?", required: false },
      {
        ...createDefaultField("multiple_choice"),
        label: "Would you recommend us?",
        required: true,
        options: ["Yes", "No", "Maybe"],
      },
      { ...createDefaultField("email"), label: "Email for follow-up", required: false },
    ],
  },
  {
    id: "event",
    name: "Event Registration",
    description: "Register guests and collect logistics details.",
    fields: [
      { ...createDefaultField("short_text"), label: "Full Name", required: true },
      { ...createDefaultField("email"), label: "Email", required: true },
      {
        ...createDefaultField("number"),
        label: "Number of Attendees",
        required: true,
        settings: { minValue: 1, maxValue: 10 },
      },
      {
        ...createDefaultField("checkboxes"),
        label: "Dietary Requirements",
        required: false,
        options: ["Vegetarian", "Vegan", "Gluten-Free", "None"],
      },
      { ...createDefaultField("long_text"), label: "Special Requests", required: false },
    ],
  },
];

export function getTemplateFields(templateId?: string) {
  const template = formTemplates.find((item) => item.id === templateId);
  return template?.fields ?? [];
}
