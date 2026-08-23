import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { DigitalTwin } from "@/models/DigitalTwin";
import { initialPatientTwin } from "@/data/mockPatient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get("patientId") || "pt_1029384";

  try {
    await connectToDatabase();
    let twin = await DigitalTwin.findOne({ patientId });

    if (!twin) {
      // Auto-create initial digital twin document if none exists
      twin = await DigitalTwin.create({
        patientId,
        name: initialPatientTwin.name,
        age: initialPatientTwin.age,
        gender: initialPatientTwin.gender,
        overallScore: initialPatientTwin.overallScore,
        reportsCount: initialPatientTwin.reportsCount,
        riskAlertsCount: initialPatientTwin.riskAlertsCount,
        upcomingCheckups: initialPatientTwin.upcomingCheckups,
        vitals: initialPatientTwin.vitals,
        organs: initialPatientTwin.organs,
      });
    }

    return NextResponse.json({ success: true, source: "mongodb", data: twin });
  } catch (error: any) {
    console.warn("MongoDB query fallback:", error.message);
    // Graceful offline fallback to mock data
    return NextResponse.json({
      success: true,
      source: "mock-fallback",
      data: initialPatientTwin,
    });
  }
}

export async function POST(request: Request) {
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
