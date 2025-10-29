import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PrescriptionsList from "./PrescriptionsList";

export default async function PrescriptionsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  let prescriptions: any[] = [];

  if ((session as any).user.role === "PATIENT") {
    const patient = await prisma.patient.findFirst({
      where: { userId: (session as any).user.id },
    });

    if (patient) {
      prescriptions = await prisma.prescription.findMany({
        where: { patientId: patient.id },
        include: {
          doctor: { include: { user: true } },
          patient: { include: { user: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }
  } else if ((session as any).user.role === "DOCTOR") {
    const doctor = await prisma.doctor.findFirst({
      where: { userId: (session as any).user.id },
    });

    if (doctor) {
      prescriptions = await prisma.prescription.findMany({
        where: { doctorId: doctor.id },
        include: {
          doctor: { include: { user: true } },
          patient: { include: { user: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }
  } else {
    prescriptions = await prisma.prescription.findMany({
      include: {
        doctor: { include: { user: true } },
        patient: { include: { user: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

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
          <h1 className="text-3xl text-black font-bold">Prescriptions</h1>
          {(session as any).user.role === "DOCTOR" && (
            <Link
              href="/dashboard/prescriptions/new"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Prescription
            </Link>
          )}
        </div>

        <PrescriptionsList
          prescriptions={prescriptions}
          userRole={(session as any).user.role}
        />
      </div>
    </div>
  );
}
