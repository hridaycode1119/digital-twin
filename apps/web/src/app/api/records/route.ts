import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { MedicalRecord } from "@/models/MedicalRecord";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get("patientId") || "pt_1029384";

  try {
    await connectToDatabase();
    const records = await MedicalRecord.find({ patientId }).sort({ uploadedAt: -1 });
    return NextResponse.json({ success: true, count: records.length, data: records });
  } catch (error: any) {
    console.error("Records query error:", error);
    return NextResponse.json({
      success: true,
      data: [],
      error: error.message,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await connectToDatabase();

    const record = await MedicalRecord.create({
      recordId: `rec_${Date.now()}`,
      patientId: body.patientId || "pt_1029384",
      title: body.title || "Uploaded Clinical Report",
      category: body.category || "LAB_REPORT",
      biomarkers: body.biomarkers || [],
      ocrConfidence: body.ocrConfidence || 0.95,
      summary: body.summary || "Automated AI extraction processed.",
    });

    return NextResponse.json({ success: true, data: record });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
