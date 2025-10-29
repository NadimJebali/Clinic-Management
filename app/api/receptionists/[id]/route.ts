import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || (session as any).user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

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
