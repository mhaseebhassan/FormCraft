import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const NotificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["new_response", "form_closed", "account"], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    formId: { type: Schema.Types.ObjectId, ref: "Form" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export type NotificationModel = InferSchemaType<typeof NotificationSchema> & { _id: mongoose.Types.ObjectId };

export const Notification: Model<NotificationModel> =
  mongoose.models.Notification ?? mongoose.model<NotificationModel>("Notification", NotificationSchema);
