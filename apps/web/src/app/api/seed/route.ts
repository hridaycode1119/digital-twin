import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { DigitalTwin } from "@/models/DigitalTwin";
import { MedicalRecord } from "@/models/MedicalRecord";
import { Prediction } from "@/models/Prediction";
import { initialPatientTwin } from "@/data/mockPatient";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Seed Demo Patient User
    const patientUser = await User.findOneAndUpdate(
      { email: "alex.mercer@example.com" },
      {
        patientId: "pt_1029384",
        name: "Alex Mercer",
        email: "alex.mercer@example.com",
        role: "PATIENT",
      },
      { upsert: true, new: true }
    );

    // 2. Seed Doctor User
    await User.findOneAndUpdate(
      { email: "dr.jenkins@hospital.org" },
      {
        patientId: "doc_991823",
        name: "Dr. Sarah Jenkins",
        email: "dr.jenkins@hospital.org",
        role: "DOCTOR",
      },
      { upsert: true, new: true }
    );

    // 3. Seed Digital Twin State
    const twin = await DigitalTwin.findOneAndUpdate(
      { patientId: "pt_1029384" },
      {
        patientId: "pt_1029384",
        name: initialPatientTwin.name,
        age: initialPatientTwin.age,
        gender: initialPatientTwin.gender,
        overallScore: initialPatientTwin.overallScore,
        reportsCount: initialPatientTwin.reportsCount,
        riskAlertsCount: initialPatientTwin.riskAlertsCount,
        upcomingCheckups: initialPatientTwin.upcomingCheckups,
        vitals: initialPatientTwin.vitals,
        organs: initialPatientTwin.organs,
      },
      { upsert: true, new: true }
    );

    // 4. Seed Medical Record
    await MedicalRecord.findOneAndUpdate(
      { recordId: "rec_9921" },
      {
        recordId: "rec_9921",
        patientId: "pt_1029384",
        title: "Comprehensive Metabolic Panel & Lipid Profile",
        category: "LAB_REPORT",
        ocrConfidence: 0.98,
        summary: "Fasting glucose and total cholesterol slightly elevated. Liver & renal function optimal.",
        biomarkers: [
          { name: "Fasting Blood Glucose", value: 108, unit: "mg/dL", referenceRange: "70-99", status: "ELEVATED", organ: "pancreas" },
          { name: "HbA1c", value: 5.8, unit: "%", referenceRange: "< 5.7", status: "ELEVATED", organ: "pancreas" },
          { name: "Total Cholesterol", value: 208, unit: "mg/dL", referenceRange: "< 200", status: "ELEVATED", organ: "heart" },
          { name: "LDL Cholesterol", value: 126, unit: "mg/dL", referenceRange: "< 100", status: "ELEVATED", organ: "heart" },
          { name: "HDL Cholesterol", value: 54, unit: "mg/dL", referenceRange: "> 40", status: "NORMAL", organ: "heart" },
          { name: "Serum Creatinine", value: 0.88, unit: "mg/dL", referenceRange: "0.74-1.35", status: "NORMAL", organ: "kidneys" },
          { name: "eGFR", value: 108, unit: "mL/min/1.73m²", referenceRange: "> 90", status: "NORMAL", organ: "kidneys" },
          { name: "ALT (Alanine Aminotransferase)", value: 22, unit: "U/L", referenceRange: "7-56", status: "NORMAL", organ: "liver" },
        ],
      },
      { upsert: true, new: true }
    );

    // 5. Seed Predictions
    await Prediction.findOneAndUpdate(
      { predictionId: "pred_cvd_01" },
      {
        predictionId: "pred_cvd_01",
        patientId: "pt_1029384",
        disease: "CVD",
        riskScore: 14.2,
        riskCategory: "MODERATE",
        timeframe: "10-Year Horizon",
        topDrivers: [
          { feature: "Systolic Blood Pressure (128 mmHg)", impact: "INCREASES_RISK", value: "128", shapValue: 0.048 },
          { feature: "Total Cholesterol (208 mg/dL)", impact: "INCREASES_RISK", value: "208", shapValue: 0.035 },
          { feature: "Non-Smoker Status", impact: "DECREASES_RISK", value: "0", shapValue: -0.062 },
        ],
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: "MongoDB seeded successfully with initial patient, twin, and clinical telemetry.",
      patient: patientUser.email,
      twinScore: twin.overallScore,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
