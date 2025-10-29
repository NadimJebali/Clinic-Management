import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only doctors and admins can update appointment status
    const userRole = (session as any).user?.role;
    if (userRole !== "DOCTOR" && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = ["SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // If doctor, verify they own the appointment
    if (userRole === "DOCTOR") {
      const doctor = await prisma.doctor.findFirst({
        where: { userId: (session as any).user.id },
      });

      if (!doctor) {
        return NextResponse.json(
          { error: "Doctor profile not found" },
          { status: 404 }
        );
      }

      const appointment = await prisma.appointment.findUnique({
        where: { id },
      });

      if (!appointment || appointment.doctorId !== doctor.id) {
        return NextResponse.json(
          { error: "Forbidden - not your appointment" },
          { status: 403 }
        );
      }
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        doctor: { include: { user: true } },
        patient: { include: { user: true } },
      },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can delete appointments
    if ((session as any).user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Appointment deleted" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
