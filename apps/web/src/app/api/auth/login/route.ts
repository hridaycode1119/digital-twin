import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Auto-provision demo accounts if logging in for the first time
      user = await User.create({
        patientId: `pt_${Date.now()}`,
        name: email.split("@")[0].replace(".", " "),
        email: email.toLowerCase(),
        password: password || "password123",
        role: "PATIENT",
      });
    }

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
