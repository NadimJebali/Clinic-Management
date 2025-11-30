import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, requireAuth } from "@/lib/auth-guards";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        user: true,
        clinic: true,
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json({ doctor });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch doctor" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireRole(["ADMIN"]);
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json();
    const { name, email, specialty, licenseNumber, phone, clinicId } = body;

    // Find the doctor with user
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Update user information
    await prisma.user.update({
      where: { id: doctor.userId },
      data: {
        name,
        email,
      },
    });

    // Update doctor information
    const updatedDoctor = await prisma.doctor.update({
      where: { id },
      data: {
        specialty,
        licenseNumber,
        phone,
        clinicId: clinicId || null,
      },
      include: {
        user: true,
        clinic: true,
      },
    });

    return NextResponse.json({ doctor: updatedDoctor });
  } catch (error) {
    console.error("Error updating doctor:", error);
    return NextResponse.json(
      { error: "Failed to update doctor" },
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
    await prisma.doctor.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete doctor" },
      { status: 500 }
    );
  }
}
