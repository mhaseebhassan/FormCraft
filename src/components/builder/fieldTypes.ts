import { Calendar, FileText, Hash, Mail, Phone, Star, Text, ToggleLeft, Upload, ListChecks, List, Rows3 } from "lucide-react";
import type { FieldTypeConfig } from "@/types";

export const fieldTypes: FieldTypeConfig[] = [
  { type: "short_text", label: "Short Text", description: "Single-line answer", icon: Text, group: "Basic" },
  { type: "long_text", label: "Long Text", description: "Paragraph answer", icon: FileText, group: "Basic" },
  { type: "email", label: "Email", description: "Validated email", icon: Mail, group: "Basic" },
  { type: "phone", label: "Phone", description: "Phone number", icon: Phone, group: "Basic" },
  { type: "number", label: "Number", description: "Numeric answer", icon: Hash, group: "Basic" },
  { type: "multiple_choice", label: "Multiple Choice", description: "Pick one", icon: ToggleLeft, group: "Choice" },
  { type: "checkboxes", label: "Checkboxes", description: "Pick many", icon: ListChecks, group: "Choice" },
  { type: "dropdown", label: "Dropdown", description: "Compact options", icon: List, group: "Choice" },
  { type: "rating", label: "Rating", description: "Stars or score", icon: Star, group: "Advanced" },
  { type: "date", label: "Date", description: "Date picker", icon: Calendar, group: "Advanced" },
  { type: "file_upload", label: "File Upload", description: "Collect files", icon: Upload, group: "Advanced" },
  { type: "section_break", label: "Section Break", description: "Organize form", icon: Rows3, group: "Layout" },
];
