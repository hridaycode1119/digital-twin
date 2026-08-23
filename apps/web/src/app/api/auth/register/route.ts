import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { DigitalTwin } from "@/models/DigitalTwin";
import { initialPatientTwin } from "@/data/mockPatient";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role = "PATIENT" } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { success: false, error: "Name and email are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const patientId = `pt_${Date.now()}`;
    const user = await User.create({
      patientId,
      name,
      email: email.toLowerCase(),
      password,
      role,
    });

    // Initialize the user's initial digital twin state in MongoDB
    await DigitalTwin.create({
      patientId,
      name,
      age: 35,
      gender: "Unspecified",
      overallScore: 85,
      reportsCount: 0,
      riskAlertsCount: 0,
      upcomingCheckups: 0,
      vitals: initialPatientTwin.vitals,
      organs: initialPatientTwin.organs,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        patientId: user.patientId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
