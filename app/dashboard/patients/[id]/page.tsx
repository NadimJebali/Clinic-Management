import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PatientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      user: true,
      appointments: {
        include: {
          doctor: { include: { user: true } },
        },
        orderBy: { dateTime: "desc" },
      },
      medicalRecords: {
        include: {
          doctor: { include: { user: true } },
        },
        orderBy: { visitDate: "desc" },
      },
      prescriptions: {
        include: {
          doctor: { include: { user: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!patient) {
    return (
      <div className="min-h-screen text-gray-600 bg-gray-100">
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto">
            <Link href="/dashboard" className="text-2xl font-bold">
              MedFlow
            </Link>
          </div>
        </nav>
        <div className="container mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Patient Not Found
            </h1>
            <Link
              href="/dashboard/patients"
              className="text-blue-600 hover:underline"
            >
              Back to Patients List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-600 bg-gray-100">
      {/* Navigation */}
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold">
            MedFlow
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/patients"
              className="text-white hover:text-gray-200"
            >
              Back to Patients
            </Link>
            <span>{(session as any).user?.name}</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        {/* Patient Information Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Patient Profile
            </h1>
            {((session as any).user?.role === "ADMIN" ||
              (session as any).user?.role === "RECEPTIONIST") && (
              <Link
                href={`/dashboard/patients/${id}/edit`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit Profile
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Personal Information
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 font-medium">Name:</span>
                  <p className="text-lg">{patient.user.name}</p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Email:</span>
                  <p className="text-lg">{patient.user.email}</p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Phone:</span>
                  <p className="text-lg">{patient.phone || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Gender:</span>
                  <p className="text-lg">{patient.gender || "N/A"}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Medical Information
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 font-medium">
                    Date of Birth:
                  </span>
                  <p className="text-lg">
                    {patient.dateOfBirth
                      ? new Date(patient.dateOfBirth).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Blood Type:</span>
                  <p className="text-lg">{patient.bloodType || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Address:</span>
                  <p className="text-lg">{patient.address || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Total Appointments
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {patient.appointments.length}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Medical Records
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {patient.medicalRecords.length}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Prescriptions
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {patient.prescriptions.length}
            </p>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Recent Appointments
          </h2>
          {patient.appointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {patient.appointments.slice(0, 5).map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(appointment.dateTime).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {appointment.doctor.user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            appointment.status === "SCHEDULED"
                              ? "bg-blue-100 text-blue-800"
                              : appointment.status === "CONFIRMED"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "COMPLETED"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {appointment.reason || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No appointments found
            </p>
          )}
        </div>

        {/* Medical Records */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Medical Records
          </h2>
          {patient.medicalRecords.length > 0 ? (
            <div className="space-y-4">
              {patient.medicalRecords.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  className="border-l-4 border-blue-500 pl-4 py-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {record.diagnosis}
                      </p>
                      <p className="text-sm text-gray-600">
                        Dr. {record.doctor.user.name} -{" "}
                        {new Date(record.visitDate).toLocaleDateString()}
                      </p>
                      {record.symptoms && (
                        <p className="text-sm text-gray-600 mt-1">
                          Symptoms: {record.symptoms}
                        </p>
                      )}
                      {record.treatment && (
                        <p className="text-sm text-gray-600">
                          Treatment: {record.treatment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No medical records found
            </p>
          )}
        </div>

        {/* Prescriptions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Prescriptions
          </h2>
          {patient.prescriptions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {patient.prescriptions.slice(0, 6).map((prescription) => (
                <div key={prescription.id} className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-2">
                    {prescription.medication}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-gray-600">Dosage:</span>{" "}
                      {prescription.dosage}
                    </p>
                    <p>
                      <span className="text-gray-600">Frequency:</span>{" "}
                      {prescription.frequency}
                    </p>
                    <p>
                      <span className="text-gray-600">Duration:</span>{" "}
                      {prescription.duration}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Prescribed by: Dr. {prescription.doctor.user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Date:{" "}
                      {new Date(prescription.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No prescriptions found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
