import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  patientId: string;
  name: string;
  email: string;
  password?: string;
  role: "PATIENT" | "DOCTOR" | "RESEARCHER";
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    patientId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["PATIENT", "DOCTOR", "RESEARCHER"],
      default: "PATIENT",
    },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
