"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/lib/axios";

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
  const [searchTerm, setSearchTerm] = useState("");

  // Filter doctors based on search term
  const filteredDoctors = useMemo(() => {
    if (!searchTerm.trim()) return doctors;

    const term = searchTerm.toLowerCase();
    return doctors.filter((doctor) => {
      return (
        doctor.user.name.toLowerCase().includes(term) ||
        doctor.user.email.toLowerCase().includes(term) ||
        doctor.specialty.toLowerCase().includes(term) ||
        doctor.licenseNumber.toLowerCase().includes(term) ||
        doctor.phone?.toLowerCase().includes(term)
      );
    });
  }, [doctors, searchTerm]);

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
      await axios.delete(`/doctors/${id}`);
      router.refresh();
    } catch (error: any) {
      alert(error.response?.data?.error || "Error deleting doctor");
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
            placeholder="Search doctors by name, email, specialty, license number, or phone..."
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
            Found {filteredDoctors.length} doctor(s)
          </p>
        )}
      </div>

      {/* Doctors Table */}
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
            {filteredDoctors.map((doctor) => (
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
                        onClick={() =>
                          handleDelete(doctor.id, doctor.user.name)
                        }
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

        {filteredDoctors.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? "No doctors match your search" : "No doctors found"}
          </div>
        )}
      </div>
    </div>
  );
}
