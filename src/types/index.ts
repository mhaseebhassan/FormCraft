import type { LucideIcon } from "lucide-react";

export type FormStatus = "draft" | "active" | "closed";
export type DisplayMode = "classic" | "conversational";
export type FontFamily = "inter" | "poppins" | "georgia";

export type FieldType =
  | "short_text"
  | "long_text"
  | "multiple_choice"
  | "checkboxes"
  | "dropdown"
  | "rating"
  | "date"
  | "email"
  | "phone"
  | "number"
  | "file_upload"
  | "section_break";

export type PrimitiveAnswer = string | number | boolean | string[] | null;
export type Answers = Record<string, PrimitiveAnswer>;

export interface FieldSettings {
  minValue?: number;
  maxValue?: number;
  minLabel?: string;
  maxLabel?: string;
  maxRating?: 3 | 5 | 10;
  allowedFileTypes?: string[];
  maxFileSizeMB?: 1 | 5 | 10 | 25;
  sectionTitle?: string;
  sectionDescription?: string;
  minLength?: number;
  maxLength?: number;
  customErrorMessage?: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helperText?: string;
  required: boolean;
  options: string[];
  settings: FieldSettings;
}

export interface FormSettings {
  submitButtonLabel: string;
  thankYouMessage: string;
  redirectUrl?: string;
  displayMode: DisplayMode;
  theme: {
    primaryColor: string;
    backgroundColor: string;
    fontFamily: FontFamily;
  };
  notifications: {
    sendConfirmationToRespondent: boolean;
    sendNotificationToOwner: boolean;
    notificationEmail?: string;
  };
  collectEmailAutomatically: boolean;
}

export interface FormDocumentShape {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  slug: string;
  status: FormStatus;
  fields: FormField[];
  settings: FormSettings;
  responseCount: number;
  lastResponseAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResponseMetadata {
  ipAddress?: string;
  userAgent?: string;
  startedAt: string;
  completedAt: string;
  timeToCompleteSeconds: number;
  referrer?: string;
}

export interface ResponseDocumentShape {
  _id: string;
  formId: string;
  userId?: string;
  answers: Answers;
  metadata: ResponseMetadata;
  isComplete: boolean;
  createdAt: string;
}

export interface UserDocumentShape {
  _id: string;
  name: string;
  email: string;
  image?: string;
  isPro: boolean;
  stripeCustomerId?: string;
  onboardingComplete: boolean;
  createdAt: string;
}

export interface NotificationDocumentShape {
  _id: string;
  userId: string;
  type: "new_response" | "form_closed" | "account";
  title: string;
  message: string;
  formId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface FieldTypeConfig {
  type: FieldType;
  label: string;
  description: string;
  icon: LucideIcon;
  group: "Basic" | "Choice" | "Advanced" | "Layout";
}

export interface ApiError {
  error: string;
}
