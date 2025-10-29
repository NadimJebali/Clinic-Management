"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  createdAt: Date;
  patient: { user: { name: string } };
  doctor: { user: { name: string } };
}

export default function PrescriptionsList({
  prescriptions,
  userRole,
}: {
  prescriptions: Prescription[];
  userRole: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this prescription?")) {
      return;
    }

    setDeleting(id);

    try {
      const response = await fetch(`/api/prescriptions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to delete prescription");
      }
    } catch (error) {
      alert("Error deleting prescription");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="grid grid-cols-1 text-gray-600 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {prescriptions.map((prescription) => (
        <div key={prescription.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold">{prescription.medication}</h3>
            {userRole === "ADMIN" && (
              <button
                onClick={() => handleDelete(prescription.id)}
                disabled={deleting === prescription.id}
                className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700 disabled:bg-gray-400"
              >
                {deleting === prescription.id ? "..." : "Delete"}
              </button>
            )}
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Patient:</span>{" "}
              <span className="font-semibold">
                {prescription.patient.user.name}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Doctor:</span>{" "}
              <span className="font-semibold">
                {prescription.doctor.user.name}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Dosage:</span>{" "}
              <span>{prescription.dosage}</span>
            </div>
            <div>
              <span className="text-gray-600">Frequency:</span>{" "}
              <span>{prescription.frequency}</span>
            </div>
            <div>
              <span className="text-gray-600">Duration:</span>{" "}
              <span>{prescription.duration}</span>
            </div>
            {prescription.instructions && (
              <div>
                <span className="text-gray-600">Instructions:</span>{" "}
                <p className="mt-1">{prescription.instructions}</p>
              </div>
            )}
            <div className="text-xs text-gray-500 mt-4">
              Created: {new Date(prescription.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}

      {prescriptions.length === 0 && (
        <div className="col-span-3 bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No prescriptions found
        </div>
      )}
    </div>
  );
}
