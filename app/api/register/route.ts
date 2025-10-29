import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Create role-specific profile
    if (role === "PATIENT") {
      await prisma.patient.create({
        data: {
          userId: user.id,
        },
      });
    } else if (role === "DOCTOR") {
      await prisma.doctor.create({
        data: {
          userId: user.id,
          specialty: "General",
          licenseNumber: `LIC-${Date.now()}`,
        },
      });
    } else if (role === "RECEPTIONIST") {
      await prisma.receptionist.create({
        data: {
          userId: user.id,
        },
      });
    }

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
