"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

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
  const [searchTerm, setSearchTerm] = useState("");

  // Filter prescriptions based on search term
  const filteredPrescriptions = useMemo(() => {
    if (!searchTerm.trim()) return prescriptions;

    const term = searchTerm.toLowerCase();
    return prescriptions.filter((prescription) => {
      return (
        prescription.medication.toLowerCase().includes(term) ||
        prescription.patient.user.name.toLowerCase().includes(term) ||
        prescription.doctor.user.name.toLowerCase().includes(term) ||
        prescription.dosage.toLowerCase().includes(term) ||
        prescription.frequency.toLowerCase().includes(term) ||
        prescription.duration.toLowerCase().includes(term) ||
        prescription.instructions?.toLowerCase().includes(term)
      );
    });
  }, [prescriptions, searchTerm]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this prescription?")) {
      return;
    }

    setDeleting(id);

    try {
      await axios.delete(`/prescriptions/${id}`);
      router.refresh();
    } catch (error: any) {
      alert(error.response?.data?.error || "Error deleting prescription");
    } finally {
      setDeleting(null);
    }
  }

  function handlePrint(prescription: Prescription) {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Prescription - ${prescription.medication}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
            .header { margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; color: #4b5563; }
            .value { margin-left: 10px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Medical Prescription</h1>
            <p><span class="label">Date:</span><span class="value">${new Date(
              prescription.createdAt
            ).toLocaleDateString()}</span></p>
          </div>
          <div class="section">
            <p><span class="label">Patient:</span><span class="value">${
              prescription.patient.user.name
            }</span></p>
            <p><span class="label">Prescribing Doctor:</span><span class="value">${
              prescription.doctor.user.name
            }</span></p>
          </div>
          <div class="section">
            <h2>Prescription Details</h2>
            <p><span class="label">Medication:</span><span class="value">${
              prescription.medication
            }</span></p>
            <p><span class="label">Dosage:</span><span class="value">${
              prescription.dosage
            }</span></p>
            <p><span class="label">Frequency:</span><span class="value">${
              prescription.frequency
            }</span></p>
            <p><span class="label">Duration:</span><span class="value">${
              prescription.duration
            }</span></p>
            ${
              prescription.instructions
                ? `<p><span class="label">Instructions:</span><span class="value">${prescription.instructions}</span></p>`
                : ""
            }
          </div>
          <div class="footer">
            <p>This is a computer-generated prescription. Please consult your doctor for any questions.</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search prescriptions by medication, patient, doctor, or details..."
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
            Found {filteredPrescriptions.length} prescription(s)
          </p>
        )}
      </div>

      {/* Prescriptions Grid */}
      <div className="grid grid-cols-1 text-gray-600 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrescriptions.map((prescription) => (
          <div key={prescription.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold">{prescription.medication}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePrint(prescription)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                  title="Print Prescription"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  Print
                </button>
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

        {filteredPrescriptions.length === 0 && (
          <div className="col-span-3 bg-white rounded-lg shadow p-8 text-center text-gray-500">
            {searchTerm
              ? "No prescriptions match your search"
              : "No prescriptions found"}
          </div>
        )}
      </div>
    </div>
  );
}
