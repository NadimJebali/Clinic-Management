import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth-guards";

// GET all clinics
export async function GET() {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const clinics = await prisma.clinic.findMany({
      include: {
        _count: {
          select: {
            doctors: true,
            patients: true,
            receptionists: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(clinics);
  } catch (error) {
    console.error("Error fetching clinics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create new clinic
export async function POST(request: Request) {
  try {
    const { error, session } = await requireRole(["ADMIN"]);
    if (error) return error;

    const body = await request.json();
    const { name, address, phone, email, description } = body;

    // Validation
    if (!name || !address || !phone || !email) {
      return NextResponse.json(
        { error: "Name, address, phone, and email are required" },
        { status: 400 }
      );
    }

    const clinic = await prisma.clinic.create({
      data: {
        name,
        address,
        phone,
        email,
        description,
      },
    });

    return NextResponse.json(clinic, { status: 201 });
  } catch (error) {
    console.error("Error creating clinic:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
