import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guards";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error, session } = await requireRole(["ADMIN"]);
    if (error) return error;

    const { id } = await params;

    await prisma.medicalRecord.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Medical record deleted" });
  } catch (error) {
    console.error("Error deleting medical record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
