"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Patient {
  id: string;
  phone?: string | null;
  bloodType?: string | null;
  address?: string | null;
  user: {
    name: string;
    email: string;
  };
}

export default function PatientsList({
  patients,
  userRole,
}: {
  patients: Patient[];
  userRole: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (
      !confirm(
        `Are you sure you want to delete patient ${name}? This will also delete all their appointments, medical records, and prescriptions.`
      )
    ) {
      return;
    }

    setDeleting(id);

    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to delete patient");
      }
    } catch (error) {
      alert("Error deleting patient");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="bg-white text-gray-600 rounded-lg shadow overflow-hidden">
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
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Blood Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y text-gray-600 divide-gray-200">
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {patient.user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {patient.user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {patient.phone || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {patient.bloodType || "N/A"}
              </td>
               <td className="px-6 py-4 whitespace-nowrap">
                {patient.address || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/patients/${patient.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block"
                  >
                    View Profile
                  </Link>
                  {userRole === "ADMIN" && (
                    <button
                      onClick={() =>
                        handleDelete(patient.id, patient.user.name)
                      }
                      disabled={deleting === patient.id}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
                    >
                      {deleting === patient.id ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {patients.length === 0 && (
        <div className="text-center py-8 text-gray-500">No patients found</div>
      )}
    </div>
  );
}
