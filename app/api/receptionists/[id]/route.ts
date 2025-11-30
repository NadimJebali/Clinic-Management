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
    const receptionist = await prisma.receptionist.findUnique({
      where: { id },
      include: {
        user: true,
        clinic: true,
      },
    });

    if (!receptionist) {
      return NextResponse.json(
        { error: "Receptionist not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ receptionist });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch receptionist" },
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
    const { name, email, phone, clinicId } = body;

    // Find the receptionist with user
    const receptionist = await prisma.receptionist.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!receptionist) {
      return NextResponse.json(
        { error: "Receptionist not found" },
        { status: 404 }
      );
    }

    // Update user information
    await prisma.user.update({
      where: { id: receptionist.userId },
      data: {
        name,
        email,
      },
    });

    // Update receptionist information
    const updatedReceptionist = await prisma.receptionist.update({
      where: { id },
      data: {
        phone,
        clinicId: clinicId || null,
      },
      include: {
        user: true,
        clinic: true,
      },
    });

    return NextResponse.json({ receptionist: updatedReceptionist });
  } catch (error) {
    console.error("Error updating receptionist:", error);
    return NextResponse.json(
      { error: "Failed to update receptionist" },
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
    await prisma.receptionist.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Receptionist deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete receptionist" },
      { status: 500 }
    );
  }
}
