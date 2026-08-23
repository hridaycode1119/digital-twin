import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { DigitalTwin } from "@/models/DigitalTwin";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role = "PATIENT" } = await request.json();

    if (!email || !name || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const sanitizedEmail = email.toLowerCase().trim();
    const patientId = `pt_${Date.now()}`;

    // Strictly connect to MongoDB
    await connectToDatabase();

    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists in MongoDB. Please log in." },
        { status: 409 }
      );
    }

    const user = await User.create({
      patientId,
      name: name.trim(),
      email: sanitizedEmail,
      password,
      role,
    });

    await DigitalTwin.create({
      patientId,
      name: name.trim(),
      age: 28,
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
      organs: {},
    });

    return NextResponse.json({
      success: true,
      source: "mongodb",
      user: {
        id: user._id.toString(),
        patientId: user.patientId,
        name: user.name,
        email: user.email,
        role: user.role,
        overallScore: 88,
        bloodPressure: "120/80",
        fastingGlucose: 95,
        heartRate: 72,
      },
    });
  } catch (error: any) {
    console.error("MongoDB Registration Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "MongoDB registration failed. Database connection required.",
      },
      { status: 500 }
    );
  }
}
