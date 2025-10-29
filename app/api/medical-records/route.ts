import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only doctors can create medical records
    if ((session as any).user?.role !== "DOCTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { patientId, diagnosis, symptoms, treatment, notes } = body;

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

    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        patientId,
        doctorId: doctor.id,
        diagnosis,
        symptoms,
        treatment,
        notes,
      },
    });

    return NextResponse.json({ medicalRecord }, { status: 201 });
  } catch (error) {
    console.error("Error creating medical record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const medicalRecords = await prisma.medicalRecord.findMany({
      include: {
        doctor: { include: { user: true } },
        patient: { include: { user: true } },
      },
      orderBy: {
        visitDate: "desc",
      },
    });

    return NextResponse.json({ medicalRecords });
  } catch (error) {
    console.error("Error fetching medical records:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
