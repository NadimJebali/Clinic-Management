import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ClinicsList from "./ClinicsList";

export default async function ClinicsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const clinics = await prisma.clinic.findMany({
    include: {
      _count: {
        select: {
          doctors: true,
          patients: true,
          receptionists: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen text-gray-600 bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold">
            MedFlow
          </Link>
          <span>{(session as any).user.name}</span>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl text-black font-bold">Clinics</h1>
          {(session as any).user.role === "ADMIN" && (
            <Link
              href="/dashboard/clinics/new"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add New Clinic
            </Link>
          )}
        </div>

        <ClinicsList clinics={clinics} userRole={(session as any).user.role} />
      </div>
    </div>
  );
}
