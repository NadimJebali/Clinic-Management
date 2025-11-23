import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guards";

export async function POST(request: NextRequest) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const body = await request.json();
    const { patientId, doctorId, dateTime, duration, reason } = body;

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        dateTime: new Date(dateTime),
        duration,
        reason,
        status: "SCHEDULED",
      },
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const appointments = await prisma.appointment.findMany({
      include: {
        doctor: { include: { user: true } },
        patient: { include: { user: true } },
      },
      orderBy: {
        dateTime: "desc",
      },
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
