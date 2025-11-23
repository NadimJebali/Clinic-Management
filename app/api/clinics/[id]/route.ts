import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth-guards";

// GET single clinic
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const { id } = await params;

    const clinic = await prisma.clinic.findUnique({
      where: { id },
      include: {
        doctors: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        patients: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        receptionists: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!clinic) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
    }

    return NextResponse.json(clinic);
  } catch (error) {
    console.error("Error fetching clinic:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH update clinic
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error, session } = await requireRole(["ADMIN"]);
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const { name, address, phone, email, description } = body;

    const clinic = await prisma.clinic.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(address && { address }),
        ...(phone && { phone }),
        ...(email && { email }),
        ...(description !== undefined && { description }),
      },
    });

    return NextResponse.json(clinic);
  } catch (error) {
    console.error("Error updating clinic:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE clinic
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error, session } = await requireRole(["ADMIN"]);
    if (error) return error;

    const { id } = await params;

    await prisma.clinic.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Clinic deleted successfully" });
  } catch (error) {
    console.error("Error deleting clinic:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
