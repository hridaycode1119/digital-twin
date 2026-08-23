import mongoose, { Schema, Document, Model } from "mongoose";

export interface IShapDriver {
  feature: string;
  impact: "INCREASES_RISK" | "DECREASES_RISK";
  value: string;
  shapValue: number;
}

export interface IPrediction extends Document {
  predictionId: string;
  patientId: string;
  disease: "CVD" | "DIABETES_T2" | "HYPERTENSION" | "CHRONIC_KIDNEY";
  riskScore: number;
  riskCategory: "LOW" | "MODERATE" | "HIGH";
  timeframe: string;
  topDrivers: IShapDriver[];
  generatedAt: Date;
}

const PredictionSchema: Schema = new Schema(
  {
    predictionId: { type: String, required: true, unique: true, index: true },
    patientId: { type: String, required: true, index: true },
    disease: {
      type: String,
      enum: ["CVD", "DIABETES_T2", "HYPERTENSION", "CHRONIC_KIDNEY"],
      required: true,
    },
    riskScore: { type: Number, required: true },
    riskCategory: { type: String, enum: ["LOW", "MODERATE", "HIGH"], required: true },
    timeframe: { type: String, default: "10-Year Horizon" },
    topDrivers: [
      {
        feature: { type: String, required: true },
        impact: { type: String, enum: ["INCREASES_RISK", "DECREASES_RISK"] },
        value: { type: String },
        shapValue: { type: Number },
      },
    ],
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Prediction: Model<IPrediction> =
  mongoose.models.Prediction ||
  mongoose.model<IPrediction>("Prediction", PredictionSchema);
