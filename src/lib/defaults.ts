import type { FieldType, FormField, FormSettings } from "@/types";

export const defaultFormSettings: FormSettings = {
  submitButtonLabel: "Submit",
  thankYouMessage: "Thank you for your response!",
  displayMode: "classic",
  theme: {
    primaryColor: "#6366F1",
    backgroundColor: "#FFFFFF",
    fontFamily: "inter",
  },
  notifications: {
    sendConfirmationToRespondent: true,
    sendNotificationToOwner: true,
  },
  collectEmailAutomatically: false,
};

export function createDefaultField(type: FieldType): FormField {
  const id = crypto.randomUUID();
  const labels: Record<FieldType, string> = {
    short_text: "Short text",
    long_text: "Long text",
    multiple_choice: "Multiple choice",
    checkboxes: "Checkboxes",
    dropdown: "Dropdown",
    rating: "Rating",
    date: "Date",
    email: "Email",
    phone: "Phone",
    number: "Number",
    file_upload: "File upload",
    section_break: "Section break",
  };

  return {
    id,
    type,
    label: labels[type],
    placeholder: type === "section_break" || type === "rating" ? undefined : "Enter your answer",
    helperText: "",
    required: type !== "section_break",
    options: ["Option 1", "Option 2"],
    settings: {
      maxRating: 5,
      minLabel: "Poor",
      maxLabel: "Excellent",
      maxFileSizeMB: 5,
      allowedFileTypes: ["image/*", "application/pdf"],
      sectionTitle: "New section",
      sectionDescription: "Add context for the next questions.",
    },
  };
}
