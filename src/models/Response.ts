import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ResponseSchema = new Schema(
  {
    formId: { type: Schema.Types.ObjectId, ref: "Form", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    answers: { type: Map, of: Schema.Types.Mixed, default: {} },
    metadata: {
      ipAddress: String,
      userAgent: String,
      startedAt: Date,
      completedAt: Date,
      timeToCompleteSeconds: Number,
      referrer: String,
    },
    isComplete: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export type ResponseModel = InferSchemaType<typeof ResponseSchema> & { _id: mongoose.Types.ObjectId };

export const Response: Model<ResponseModel> =
  mongoose.models.Response ?? mongoose.model<ResponseModel>("Response", ResponseSchema);
