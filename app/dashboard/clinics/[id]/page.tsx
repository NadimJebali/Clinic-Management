import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function ClinicDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const clinic = await prisma.clinic.findUnique({
    where: { id },
    include: {
      doctors: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      patients: {
        select: {
          id: true,
          userId: true,
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
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!clinic) {
    redirect("/dashboard/clinics");
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-600">
      <Navbar
        userName={(session as any).user.name}
        userRole={(session as any).user.role}
        showBackToDashboard={true}
      />

      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Link
            href="/dashboard/clinics"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <span>←</span> Back to Clinics
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-black">{clinic.name}</h1>
            {(session as any).user.role === "ADMIN" && (
              <Link
                href={`/dashboard/clinics/${clinic.id}/edit`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit Clinic
              </Link>
            )}
          </div>

          {/* Clinic Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-xl font-bold text-black mb-4">
                Contact Information
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold">Address:</span>
                  <p className="mt-1">{clinic.address}</p>
                </div>
                <div>
                  <span className="font-semibold">Phone:</span>
                  <p className="mt-1">{clinic.phone}</p>
                </div>
                <div>
                  <span className="font-semibold">Email:</span>
                  <p className="mt-1">{clinic.email}</p>
                </div>
              </div>
            </div>

            {clinic.description && (
              <div>
                <h2 className="text-xl font-bold text-black mb-4">
                  Description
                </h2>
                <p className="text-gray-600">{clinic.description}</p>
              </div>
            )}
          </div>

          {/* Staff Sections */}
          <div className="space-y-8">
            {/* Doctors */}
            <div>
              <h2 className="text-xl font-bold text-black mb-4">
                Doctors ({clinic.doctors.length})
              </h2>
              {clinic.doctors.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clinic.doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <p className="font-semibold text-black">
                        {doctor.user.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {doctor.user.email}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        {doctor.specialty}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No doctors assigned to this clinic
                </p>
              )}
            </div>

            {/* Receptionists */}
            <div>
              <h2 className="text-xl font-bold text-black mb-4">
                Receptionists ({clinic.receptionists.length})
              </h2>
              {clinic.receptionists.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clinic.receptionists.map((receptionist) => (
                    <div
                      key={receptionist.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <p className="font-semibold text-black">
                        {receptionist.user.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {receptionist.user.email}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No receptionists assigned to this clinic
                </p>
              )}
            </div>

            {/* Patients */}
            <div>
              <h2 className="text-xl font-bold text-black mb-4">
                Patients ({clinic.patients.length})
              </h2>
              {clinic.patients.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clinic.patients.map((patient) => (
                    <div
                      key={patient.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <p className="font-semibold text-black">
                        {patient.user.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {patient.user.email}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No patients registered at this clinic
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
