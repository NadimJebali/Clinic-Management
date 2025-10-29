"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Doctor {
  id: string;
  specialty: string;
  licenseNumber: string;
  phone?: string | null;
  user: {
    name: string;
    email: string;
  };
  appointments: any[];
}

export default function DoctorsList({
  doctors,
  userRole,
}: {
  doctors: Doctor[];
  userRole: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (
      !confirm(
        `Are you sure you want to delete doctor ${name}? This will also delete all their appointments, medical records, and prescriptions.`
      )
    ) {
      return;
    }

    setDeleting(id);

    try {
      const response = await fetch(`/api/doctors/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to delete doctor");
      }
    } catch (error) {
      alert("Error deleting doctor");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Specialty
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              License Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Appointments
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {doctors.map((doctor) => (
            <tr key={doctor.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {doctor.user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {doctor.user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {doctor.specialty}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {doctor.licenseNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {doctor.phone || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  {doctor.appointments.length}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/doctors/${doctor.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block"
                  >
                    View Profile
                  </Link>
                  {userRole === "ADMIN" && (
                    <button
                      onClick={() => handleDelete(doctor.id, doctor.user.name)}
                      disabled={deleting === doctor.id}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
                    >
                      {deleting === doctor.id ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {doctors.length === 0 && (
        <div className="text-center py-8 text-gray-500">No doctors found</div>
      )}
    </div>
  );
}
