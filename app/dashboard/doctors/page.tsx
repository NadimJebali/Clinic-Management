import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DoctorsList from "./DoctorsList";
import Navbar from "@/components/Navbar";

export default async function DoctorsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Only admins and receptionists can view doctors list
  if (
    (session as any).user?.role !== "ADMIN" &&
    (session as any).user?.role !== "RECEPTIONIST"
  ) {
    redirect("/dashboard");
  }

  const doctors = await prisma.doctor.findMany({
    include: {
      user: true,
      appointments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen text-gray-600 bg-gray-100">
      <Navbar
        userName={(session as any).user?.name}
        userRole={(session as any).user?.role}
        showBackToDashboard={true}
      />

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl text-black font-bold">Doctors</h1>
          {(session as any).user?.role === "ADMIN" && (
            <Link
              href="/dashboard/doctors/new"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add New Doctor
            </Link>
          )}
        </div>

        {/* Doctors List */}
        <DoctorsList doctors={doctors} userRole={(session as any).user?.role} />

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Total Doctors
            </h3>
            <p className="text-3xl font-bold text-blue-600">{doctors.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Total Appointments
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {doctors.reduce(
                (sum, doctor) => sum + doctor.appointments.length,
                0
              )}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Specialties
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {new Set(doctors.map((d) => d.specialty)).size}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
