import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function EditClinicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Only admins can edit clinics
  if ((session as any).user.role !== "ADMIN") {
    redirect("/dashboard/clinics");
  }

  const { id } = await params;

  const clinic = await prisma.clinic.findUnique({
    where: { id },
  });

  if (!clinic) {
    redirect("/dashboard/clinics");
  }

  async function updateClinic(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const description = formData.get("description") as string;

    try {
      await prisma.clinic.update({
        where: { id },
        data: {
          name,
          address,
          phone,
          email,
          description: description || null,
        },
      });
      redirect(`/dashboard/clinics/${id}`);
    } catch (error) {
      console.error("Error updating clinic:", error);
      throw error;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-600">
      <Navbar
        userName={(session as any).user.name}
        userRole={(session as any).user.role}
        showBackToDashboard={true}
      />

      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link
              href={`/dashboard/clinics/${id}`}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              <span>←</span> Back to Clinic
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-black mb-6">Edit Clinic</h1>

            <form action={updateClinic} className="space-y-4">
              {/* Clinic Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Clinic Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  defaultValue={clinic.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  required
                  rows={3}
                  defaultValue={clinic.address}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  defaultValue={clinic.phone}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  defaultValue={clinic.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  defaultValue={clinic.description || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                >
                  Update Clinic
                </button>
                <Link
                  href={`/dashboard/clinics/${id}`}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
