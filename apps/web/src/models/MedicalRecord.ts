import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBiomarker {
  name: string;
  value: number | string;
  unit: string;
  referenceRange: string;
  status: "NORMAL" | "ELEVATED" | "CRITICAL";
  organ: string;
}

export interface IMedicalRecord extends Document {
  recordId: string;
  patientId: string;
  title: string;
  category: "LAB_REPORT" | "PRESCRIPTION" | "WEARABLE_LOG" | "IMAGING";
  uploadedAt: Date;
  ocrConfidence: number;
  biomarkers: IBiomarker[];
  summary: string;
  fileUrl?: string;
}

const MedicalRecordSchema: Schema = new Schema(
  {
    recordId: { type: String, required: true, unique: true, index: true },
    patientId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["LAB_REPORT", "PRESCRIPTION", "WEARABLE_LOG", "IMAGING"],
      default: "LAB_REPORT",
    },
    uploadedAt: { type: Date, default: Date.now },
    ocrConfidence: { type: Number, default: 0.96 },
    biomarkers: [
      {
        name: { type: String, required: true },
        value: { type: Schema.Types.Mixed, required: true },
        unit: { type: String },
        referenceRange: { type: String },
        status: { type: String, enum: ["NORMAL", "ELEVATED", "CRITICAL"], default: "NORMAL" },
        organ: { type: String },
      },
    ],
    summary: { type: String },
    fileUrl: { type: String },
  },
  { timestamps: true }
);

export const MedicalRecord: Model<IMedicalRecord> =
  mongoose.models.MedicalRecord ||
  mongoose.model<IMedicalRecord>("MedicalRecord", MedicalRecordSchema);
