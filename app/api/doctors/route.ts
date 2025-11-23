import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { requireRole, requireAuth } from "@/lib/auth-guards";

export async function GET() {
  const { error, session } = await requireAuth();
  if (error) return error;

  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { error, session } = await requireRole(["ADMIN"]);
  if (error) return error;

  try {
    const body = await request.json();
    const { name, email, password, specialty, licenseNumber, phone } = body;

    // Validate required fields
    if (!name || !email || !password || !specialty || !licenseNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Check if license number already exists
    const existingLicense = await prisma.doctor.findUnique({
      where: { licenseNumber },
    });

    if (existingLicense) {
      return NextResponse.json(
        { error: "License number already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and doctor
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "DOCTOR",
        doctor: {
          create: {
            specialty,
            licenseNumber,
            phone: phone || null,
          },
        },
      },
      include: {
        doctor: true,
      },
    });

    return NextResponse.json(
      { message: "Doctor created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating doctor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
