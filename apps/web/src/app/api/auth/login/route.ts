import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { DigitalTwin } from "@/models/DigitalTwin";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const sanitizedEmail = email.toLowerCase().trim();

    // Strictly connect to MongoDB
    await connectToDatabase();

    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "No account found with this email in MongoDB. Please sign up first.",
        },
        { status: 401 }
      );
    }

    // Verify password if user has password set
    if (user.password && user.password !== password) {
      return NextResponse.json(
        { success: false, error: "Invalid password. Please check your credentials." },
        { status: 401 }
      );
    }

    const twin = await DigitalTwin.findOne({ patientId: user.patientId });

    return NextResponse.json({
      success: true,
      source: "mongodb",
      user: {
        id: user._id.toString(),
        patientId: user.patientId,
        name: user.name,
        email: user.email,
        role: user.role,
        overallScore: twin?.overallScore || 88,
        bloodPressure: twin?.vitals?.bloodPressure?.replace(" mmHg", "") || "120/80",
        fastingGlucose: twin?.vitals?.glucose || 95,
        heartRate: twin?.vitals?.heartRate || 72,
      },
    });
  } catch (error: any) {
    console.error("MongoDB Login Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "MongoDB authentication failed. Database connection required.",
      },
      { status: 500 }
    );
  }
}
