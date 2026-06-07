import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const fieldSchema = z.object({
  id: z.string(),
  type: z.enum([
    "short_text",
    "long_text",
    "multiple_choice",
    "checkboxes",
    "dropdown",
    "rating",
    "date",
    "email",
    "phone",
    "number",
    "file_upload",
    "section_break",
  ]),
  label: z.string().min(1, "Label is required"),
  placeholder: z.string().optional(),
  helperText: z.string().optional(),
  required: z.boolean(),
  options: z.array(z.string()),
  settings: z.record(z.string(), z.unknown()),
});

export const createFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  templateId: z.string().optional(),
});

export const responseSchema = z.object({
  answers: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.array(z.string()), z.null()])),
  metadata: z
    .object({
      startedAt: z.string().optional(),
      referrer: z.string().optional(),
    })
    .optional(),
});
