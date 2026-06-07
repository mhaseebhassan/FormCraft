import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const FieldSchema = new Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: [
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
      ],
      required: true,
    },
    label: { type: String, required: true },
    placeholder: { type: String },
    helperText: { type: String },
    required: { type: Boolean, default: false },
    options: { type: [String], default: [] },
    settings: {
      minValue: Number,
      maxValue: Number,
      minLabel: String,
      maxLabel: String,
      maxRating: { type: Number, default: 5 },
      allowedFileTypes: { type: [String], default: [] },
      maxFileSizeMB: { type: Number, default: 5 },
      sectionTitle: String,
      sectionDescription: String,
      minLength: Number,
      maxLength: Number,
      customErrorMessage: String,
    },
  },
  { _id: false },
);

const FormSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, default: "Untitled Form" },
    description: { type: String },
    slug: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ["draft", "active", "closed"], default: "draft" },
    fields: { type: [FieldSchema], default: [] },
    settings: {
      submitButtonLabel: { type: String, default: "Submit" },
      thankYouMessage: { type: String, default: "Thank you for your response!" },
      redirectUrl: String,
      displayMode: { type: String, enum: ["classic", "conversational"], default: "classic" },
      theme: {
        primaryColor: { type: String, default: "#6366F1" },
        backgroundColor: { type: String, default: "#FFFFFF" },
        fontFamily: { type: String, enum: ["inter", "poppins", "georgia"], default: "inter" },
      },
      notifications: {
        sendConfirmationToRespondent: { type: Boolean, default: true },
        sendNotificationToOwner: { type: Boolean, default: true },
        notificationEmail: String,
      },
      collectEmailAutomatically: { type: Boolean, default: false },
    },
    responseCount: { type: Number, default: 0 },
    lastResponseAt: { type: Date },
  },
  { timestamps: true },
);

export type FormModel = InferSchemaType<typeof FormSchema> & { _id: mongoose.Types.ObjectId };

export const Form: Model<FormModel> =
  mongoose.models.Form ?? mongoose.model<FormModel>("Form", FormSchema);
