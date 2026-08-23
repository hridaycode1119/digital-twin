import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { DigitalTwin } from "@/models/DigitalTwin";
import { initialPatientTwin } from "@/data/mockPatient";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get("patientId") || "pt_1029384";

  try {
    await connectToDatabase();
    let twin = await DigitalTwin.findOne({ patientId });

    if (!twin) {
      twin = await DigitalTwin.create({
        patientId,
        name: "Patient",
        age: 26,
        gender: "Male",
        overallScore: 88,
        reportsCount: 0,
        riskAlertsCount: 0,
        upcomingCheckups: 1,
        vitals: {
          bloodPressure: "120/80 mmHg",
          heartRate: 72,
          spo2: 99,
          glucose: 95,
          temperature: 36.8,
          bmi: 22.8,
        },
      });
    }

    return NextResponse.json({ success: true, source: "mongodb", data: twin });
  } catch (error: any) {
    console.error("Twin query error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientId = "pt_1029384", ...updates } = body;

    await connectToDatabase();
    const updatedTwin = await DigitalTwin.findOneAndUpdate(
      { patientId },
      { $set: updates },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: updatedTwin });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
