import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String },
    image: { type: String },
    isPro: { type: Boolean, default: false },
    stripeCustomerId: { type: String },
    onboardingComplete: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export type UserModel = InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };

export const User: Model<UserModel> =
  mongoose.models.User ?? mongoose.model<UserModel>("User", UserSchema);
