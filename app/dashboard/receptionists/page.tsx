import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ReceptionistsList from "./ReceptionistsList";

export default async function ReceptionistsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Only admins can view receptionists list
  if ((session as any).user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const receptionists = await prisma.receptionist.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold">
            MedFlow
          </Link>
          <span>{(session as any).user?.name}</span>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl text-black font-bold">Receptionists</h1>
          <Link
            href="/dashboard/receptionists/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add New Receptionist
          </Link>
        </div>

        {/* Receptionists List */}
        <ReceptionistsList
          receptionists={receptionists}
          userRole={(session as any).user?.role}
        />

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Total Receptionists
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {receptionists.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Active This Month
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {
                receptionists.filter(
                  (r) =>
                    new Date(r.createdAt).getMonth() === new Date().getMonth()
                ).length
              }
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              With Phone Numbers
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {receptionists.filter((r) => r.phone).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
