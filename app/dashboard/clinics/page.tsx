import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ClinicsList from "./ClinicsList";
import Navbar from "@/components/Navbar";

export default async function ClinicsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Only admins can access clinics page
  if ((session as any).user.role !== "ADMIN") {
    redirect("/dashboard");
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
      <Navbar
        userName={(session as any).user.name}
        userRole={(session as any).user.role}
        showBackToDashboard={true}
      />

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
