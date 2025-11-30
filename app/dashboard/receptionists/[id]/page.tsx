import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function ReceptionistProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Only admins can view receptionist profiles
  if ((session as any).user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const { id } = await params;

  const receptionist = await prisma.receptionist.findUnique({
    where: { id },
    include: {
      user: true,
      clinic: true,
    },
  });

  if (!receptionist) {
    return (
      <div className="min-h-screen text-gray-600 bg-gray-100">
        <Navbar showBackToDashboard={true} />
        <div className="container mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Receptionist Not Found
            </h1>
            <Link
              href="/dashboard/receptionists"
              className="text-blue-600 hover:underline"
            >
              Back to Receptionists List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-600 bg-gray-100">
      <Navbar
        userName={(session as any).user?.name}
        userRole={(session as any).user?.role}
        showBackToDashboard={true}
      />

      <div className="container mx-auto p-6">
        {/* Receptionist Information Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Receptionist Profile
            </h1>
            <Link
              href={`/dashboard/receptionists/${id}/edit`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit Profile
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Personal Information
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 font-medium">Name:</span>
                  <p className="text-lg">{receptionist.user.name}</p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Email:</span>
                  <p className="text-lg">{receptionist.user.email}</p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Phone:</span>
                  <p className="text-lg">{receptionist.phone || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Role:</span>
                  <p className="text-lg">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                      Receptionist
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Employment Information
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 font-medium">
                    Member Since:
                  </span>
                  <p className="text-lg">
                    {new Date(receptionist.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Clinic:</span>
                  <p className="text-lg">
                    {receptionist.clinic ? (
                      <Link
                        href={`/dashboard/clinics/${receptionist.clinic.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {receptionist.clinic.name}
                      </Link>
                    ) : (
                      <span className="text-gray-500">Not assigned</span>
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">User ID:</span>
                  <p className="text-sm text-gray-500">{receptionist.userId}</p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Status:</span>
                  <p className="text-lg">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Active
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Responsibilities Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Responsibilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl">📅</div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Appointment Management
                </h3>
                <p className="text-sm text-gray-600">
                  Schedule, modify, and cancel appointments
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="text-2xl">👥</div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Patient Registration
                </h3>
                <p className="text-sm text-gray-600">
                  Register new patients and update information
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl">📋</div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Records Management
                </h3>
                <p className="text-sm text-gray-600">
                  Manage patient records and documentation
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl">🏥</div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Front Desk Operations
                </h3>
                <p className="text-sm text-gray-600">
                  Handle reception and patient inquiries
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
