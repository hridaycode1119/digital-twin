import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDigitalTwin extends Document {
  patientId: string;
  name: string;
  age: number;
  gender: string;
  overallScore: number;
  reportsCount: number;
  riskAlertsCount: number;
  upcomingCheckups: number;
  vitals: {
    bloodPressure: string;
    heartRate: number;
    spo2: number;
    glucose: number;
    temperature: number;
    bmi: number;
  };
  organs: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const DigitalTwinSchema: Schema = new Schema(
  {
    patientId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    age: { type: Number, default: 38 },
    gender: { type: String, default: "Male" },
    overallScore: { type: Number, default: 87 },
    reportsCount: { type: Number, default: 24 },
    riskAlertsCount: { type: Number, default: 3 },
    upcomingCheckups: { type: Number, default: 2 },
    vitals: {
      bloodPressure: { type: String, default: "128/82 mmHg" },
      heartRate: { type: Number, default: 74 },
      spo2: { type: Number, default: 99 },
      glucose: { type: Number, default: 108 },
      temperature: { type: Number, default: 36.8 },
      bmi: { type: Number, default: 24.2 },
    },
    organs: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const DigitalTwin: Model<IDigitalTwin> =
  mongoose.models.DigitalTwin ||
  mongoose.model<IDigitalTwin>("DigitalTwin", DigitalTwinSchema);
