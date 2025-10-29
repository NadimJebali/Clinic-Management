import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PatientsList from "./PatientsList";

export default async function PatientsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const patients = await prisma.patient.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen text-gray-600 bg-gray-100">
      {/* Navigation */}
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
          <h1 className="text-3xl text-black font-bold">Patients</h1>
          {((session as any).user.role === "ADMIN" ||
            (session as any).user.role === "RECEPTIONIST") && (
            <Link
              href="/dashboard/patients/new"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add New Patient
            </Link>
          )}
        </div>

        {/* Patients List */}
        <PatientsList
          patients={patients}
          userRole={(session as any).user.role}
        />
      </div>
    </div>
  );
}
