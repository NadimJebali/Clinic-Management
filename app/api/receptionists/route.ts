import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { requireRole } from "@/lib/auth-guards";

export async function GET() {
  const { error, session } = await requireRole(["ADMIN"]);
  if (error) return error;

  try {
    const receptionists = await prisma.receptionist.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ receptionists });
  } catch (error) {
    console.error("Error fetching receptionists:", error);
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
    const { name, email, password, phone } = body;

    // Validate required fields
    if (!name || !email || !password) {
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and receptionist
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "RECEPTIONIST",
        receptionist: {
          create: {
            phone: phone || null,
          },
        },
      },
      include: {
        receptionist: true,
      },
    });

    return NextResponse.json(
      { message: "Receptionist created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating receptionist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
