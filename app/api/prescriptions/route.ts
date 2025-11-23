import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, requireAuth } from "@/lib/auth-guards";

export async function POST(request: NextRequest) {
  const { error, session } = await requireRole(["DOCTOR"]);
  if (error) return error;

  try {
    const body = await request.json();
    const { patientId, medication, dosage, frequency, duration, instructions } =
      body;

    // Get the doctor ID from the logged-in user
    const doctor = await prisma.doctor.findFirst({
      where: { userId: (session as any).user?.id },
    });

    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor profile not found" },
        { status: 404 }
      );
    }

    const prescription = await prisma.prescription.create({
      data: {
        patientId,
        doctorId: doctor.id,
        medication,
        dosage,
        frequency,
        duration,
        instructions,
      },
    });

    return NextResponse.json({ prescription }, { status: 201 });
  } catch (error) {
    console.error("Error creating prescription:", error);
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
    const prescriptions = await prisma.prescription.findMany({
      include: {
        doctor: { include: { user: true } },
        patient: { include: { user: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ prescriptions });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
