import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, requireAuth } from "@/lib/auth-guards";
import bcrypt from "bcryptjs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        user: true,
        clinic: true,
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({ patient });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch patient" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireRole(["ADMIN", "RECEPTIONIST"]);
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      address,
      dateOfBirth,
      gender,
      bloodType,
      clinicId,
    } = body;

    // Find the patient with user
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Update user information
    await prisma.user.update({
      where: { id: patient.userId },
      data: {
        name,
        email,
      },
    });

    // Update patient information
    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: {
        phone,
        address,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        bloodType,
        clinicId: clinicId || null,
      },
      include: {
        user: true,
        clinic: true,
      },
    });

    return NextResponse.json({ patient: updatedPatient });
  } catch (error) {
    console.error("Error updating patient:", error);
    return NextResponse.json(
      { error: "Failed to update patient" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireRole(["ADMIN"]);
  if (error) return error;

  const { id } = await params;

  try {
    await prisma.patient.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Patient deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete patient" },
      { status: 500 }
    );
  }
}
