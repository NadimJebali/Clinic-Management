"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/lib/axios";

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
  const [searchTerm, setSearchTerm] = useState("");

  // Filter patients based on search term
  const filteredPatients = useMemo(() => {
    if (!searchTerm.trim()) return patients;

    const term = searchTerm.toLowerCase();
    return patients.filter((patient) => {
      return (
        patient.user.name.toLowerCase().includes(term) ||
        patient.user.email.toLowerCase().includes(term) ||
        patient.phone?.toLowerCase().includes(term) ||
        patient.bloodType?.toLowerCase().includes(term) ||
        patient.address?.toLowerCase().includes(term)
      );
    });
  }, [patients, searchTerm]);

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
      await axios.delete(`/patients/${id}`);
      router.refresh();
    } catch (error: any) {
      alert(error.response?.data?.error || "Error deleting patient");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search patients by name, email, phone, blood type, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-3 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-600">
            Found {filteredPatients.length} patient(s)
          </p>
        )}
      </div>

      {/* Patients Table */}
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
            {filteredPatients.map((patient) => (
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
                      View
                    </Link>
                    {(userRole === "ADMIN" || userRole === "RECEPTIONIST") && (
                      <>
                        <Link
                          href={`/dashboard/patients/${patient.id}/edit`}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-block"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(patient.id, patient.user.name)
                          }
                          disabled={deleting === patient.id}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
                        >
                          {deleting === patient.id ? "Deleting..." : "Delete"}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPatients.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? "No patients match your search" : "No patients found"}
          </div>
        )}
      </div>
    </div>
  );
}
