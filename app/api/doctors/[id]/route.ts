import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guards";

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
