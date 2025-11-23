import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireRole, requireAuth } from "@/lib/auth-guards";

export async function POST(request: NextRequest) {
  const { error, session } = await requireRole(["ADMIN", "RECEPTIONIST"]);
  if (error) return error;

  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      phone,
      address,
      dateOfBirth,
      gender,
      bloodType,
    } = body;

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

    // Create user and patient
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "PATIENT",
      },
    });

    const patient = await prisma.patient.create({
      data: {
        userId: user.id,
        phone,
        address,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        bloodType,
      },
    });

    return NextResponse.json({ patient }, { status: 201 });
  } catch (error) {
    console.error("Error creating patient:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const { error, session } = await requireAuth();
  if (error) return error;

  try {
    const patients = await prisma.patient.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ patients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
