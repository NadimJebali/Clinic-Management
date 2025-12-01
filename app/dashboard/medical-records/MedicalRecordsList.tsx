"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

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

  function handlePrint(record: MedicalRecord) {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Medical Record - ${record.diagnosis}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
            .header { margin-bottom: 30px; }
            .section { margin-bottom: 20px; padding: 15px; background: #f9fafb; border-radius: 8px; }
            .label { font-weight: bold; color: #4b5563; display: block; margin-bottom: 5px; }
            .value { color: #1f2937; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Medical Record</h1>
            <p><span class="label">Visit Date:</span><span class="value">${new Date(
              record.visitDate
            ).toLocaleDateString()}</span></p>
          </div>
          <div class="section">
            <p><span class="label">Patient:</span><span class="value">${
              record.patient.user.name
            }</span></p>
            <p><span class="label">Attending Doctor:</span><span class="value">${
              record.doctor.user.name
            }</span></p>
          </div>
          <div class="section">
            <span class="label">Diagnosis:</span>
            <p class="value">${record.diagnosis}</p>
          </div>
          ${
            record.symptoms
              ? `
            <div class="section">
              <span class="label">Symptoms:</span>
              <p class="value">${record.symptoms}</p>
            </div>
          `
              : ""
          }
          ${
            record.treatment
              ? `
            <div class="section">
              <span class="label">Treatment:</span>
              <p class="value">${record.treatment}</p>
            </div>
          `
              : ""
          }
          ${
            record.notes
              ? `
            <div class="section">
              <span class="label">Additional Notes:</span>
              <p class="value">${record.notes}</p>
            </div>
          `
              : ""
          }
          <div class="footer">
            <p>This is a confidential medical document. Handle with care.</p>
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

              <div className="ml-4 flex flex-col gap-2">
                <button
                  onClick={() => handlePrint(record)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
                  title="Print Medical Record"
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
                    onClick={() => handleDelete(record.id)}
                    disabled={deleting === record.id}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
                  >
                    {deleting === record.id ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
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
