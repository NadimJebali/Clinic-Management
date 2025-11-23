"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

interface MedicalRecord {
  id: string;
  diagnosis: string;
  symptoms?: string;
  treatment?: string;
  notes?: string;
  visitDate: Date;
  patient: { user: { name: string } };
  doctor: { user: { name: string } };
}

export default function MedicalRecordsList({
  records,
  userRole,
}: {
  records: MedicalRecord[];
  userRole: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter medical records based on search term
  const filteredRecords = useMemo(() => {
    if (!searchTerm.trim()) return records;

    const term = searchTerm.toLowerCase();
    return records.filter((record) => {
      return (
        record.diagnosis.toLowerCase().includes(term) ||
        record.patient.user.name.toLowerCase().includes(term) ||
        record.doctor.user.name.toLowerCase().includes(term) ||
        record.symptoms?.toLowerCase().includes(term) ||
        record.treatment?.toLowerCase().includes(term) ||
        record.notes?.toLowerCase().includes(term) ||
        new Date(record.visitDate).toLocaleDateString().includes(term)
      );
    });
  }, [records, searchTerm]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this medical record?")) {
      return;
    }

    setDeleting(id);

    try {
      await axios.delete(`/medical-records/${id}`);
      router.refresh();
    } catch (error: any) {
      alert(error.response?.data?.error || "Error deleting medical record");
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
            placeholder="Search medical records by diagnosis, patient, doctor, symptoms, or treatment..."
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
            Found {filteredRecords.length} medical record(s)
          </p>
        )}
      </div>

      {/* Medical Records List */}
      <div className="space-y-4 text-gray-600">
        {filteredRecords.map((record) => (
          <div key={record.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Patient</p>
                    <p className="font-semibold">{record.patient.user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Doctor</p>
                    <p className="font-semibold">{record.doctor.user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Visit Date</p>
                    <p className="font-semibold">
                      {new Date(record.visitDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Diagnosis</p>
                    <p className="font-semibold">{record.diagnosis}</p>
                  </div>
                </div>

                {record.symptoms && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Symptoms</p>
                    <p>{record.symptoms}</p>
                  </div>
                )}

                {record.treatment && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Treatment</p>
                    <p>{record.treatment}</p>
                  </div>
                )}

                {record.notes && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Notes</p>
                    <p>{record.notes}</p>
                  </div>
                )}
              </div>

              {userRole === "ADMIN" && (
                <button
                  onClick={() => handleDelete(record.id)}
                  disabled={deleting === record.id}
                  className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
                >
                  {deleting === record.id ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredRecords.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            {searchTerm
              ? "No medical records match your search"
              : "No medical records found"}
          </div>
        )}
      </div>
    </div>
  );
}
