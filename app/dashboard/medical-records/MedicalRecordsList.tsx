"use client";

import { useState } from "react";
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

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this medical record?")) {
      return;
    }

    setDeleting(id);

    try {
      const response = await fetch(`/api/medical-records/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to delete medical record");
      }
    } catch (error) {
      alert("Error deleting medical record");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-4 text-gray-600">
      {records.map((record) => (
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

      {records.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No medical records found
        </div>
      )}
    </div>
  );
}
