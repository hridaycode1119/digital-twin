import { NextRequest, NextResponse } from "next/server";
import { generateClinicalResponse } from "@/lib/gemini";
import { connectToDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, patientId = "pt_1029384" } = body;

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Query is required." },
        { status: 400 }
      );
    }

    // Optional MongoDB connect to ensure persistence
    try {
      await connectToDatabase();
    } catch (dbErr) {
      console.warn("Database connection notice:", dbErr);
    }

    const reply = await generateClinicalResponse(query);

    return NextResponse.json({
      success: true,
      data: {
        reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        citations: [
          { title: "Comprehensive Metabolic & Lipid Panel", date: "Aug 15, 2026", recordId: "rec_001" },
          { title: "Digital Twin Continuous Telemetry Engine", date: "Live Feed", recordId: "stream_realtime" },
        ],
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
