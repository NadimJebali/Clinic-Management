"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  description?: string | null;
  _count?: {
    doctors: number;
    patients: number;
    receptionists: number;
  };
}

export default function ClinicsList({
  clinics,
  userRole,
}: {
  clinics: Clinic[];
  userRole: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter clinics based on search term
  const filteredClinics = useMemo(() => {
    if (!searchTerm.trim()) return clinics;

    const term = searchTerm.toLowerCase();
    return clinics.filter((clinic) => {
      return (
        clinic.name.toLowerCase().includes(term) ||
        clinic.address.toLowerCase().includes(term) ||
        clinic.phone.toLowerCase().includes(term) ||
        clinic.email.toLowerCase().includes(term) ||
        clinic.description?.toLowerCase().includes(term)
      );
    });
  }, [clinics, searchTerm]);

  async function handleDelete(id: string, name: string) {
    if (
      !confirm(
        `Are you sure you want to delete clinic "${name}"? This will unlink all associated doctors, patients, and receptionists.`
      )
    ) {
      return;
    }

    setDeleting(id);

    try {
      const response = await fetch(`/api/clinics/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to delete clinic");
      }
    } catch (error) {
      alert("Error deleting clinic");
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
            placeholder="Search clinics by name, address, phone, or email..."
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
            Found {filteredClinics.length} clinic(s)
          </p>
        )}
      </div>

      {/* Clinics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClinics.map((clinic) => (
          <div key={clinic.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800">{clinic.name}</h3>
              {userRole === "ADMIN" && (
                <button
                  onClick={() => handleDelete(clinic.id, clinic.name)}
                  disabled={deleting === clinic.id}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:bg-gray-400"
                >
                  {deleting === clinic.id ? "..." : "Delete"}
                </button>
              )}
            </div>

            <div className="space-y-3 text-sm text-gray-600">
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

              {clinic.description && (
                <div>
                  <span className="font-semibold">Description:</span>
                  <p className="mt-1">{clinic.description}</p>
                </div>
              )}

              {clinic._count && (
                <div className="pt-3 mt-3 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {clinic._count.doctors}
                      </p>
                      <p className="text-xs text-gray-500">Doctors</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {clinic._count.patients}
                      </p>
                      <p className="text-xs text-gray-500">Patients</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">
                        {clinic._count.receptionists}
                      </p>
                      <p className="text-xs text-gray-500">Staff</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                href={`/dashboard/clinics/${clinic.id}`}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
              >
                View Details
              </Link>
              {userRole === "ADMIN" && (
                <Link
                  href={`/dashboard/clinics/${clinic.id}/edit`}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-center"
                >
                  Edit
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredClinics.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          {searchTerm ? "No clinics match your search" : "No clinics found"}
        </div>
      )}
    </div>
  );
}
