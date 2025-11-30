"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/lib/axios";
import Navbar from "@/components/Navbar";

export default function NewPrescriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patientId: "",
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
  });

  useEffect(() => {
    // Fetch patients
    async function fetchPatients() {
      try {
        const response = await axios.get("/patients");
        setPatients(response.data.patients || []);
      } catch (error: any) {
        console.error("Error fetching patients:", error);
      }
    }

    fetchPatients();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("/prescriptions", formData);
      router.push("/dashboard/prescriptions");
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to create prescription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-gray-600 bg-gray-100">
      <Navbar showBackToDashboard={true} />

      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Create Prescription</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Patient *</label>
              <select
                value={formData.patientId}
                onChange={(e) =>
                  setFormData({ ...formData, patientId: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Patient</option>
                {patients.map((patient: any) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.user.name} - {patient.user.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Medication *</label>
              <input
                type="text"
                value={formData.medication}
                onChange={(e) =>
                  setFormData({ ...formData, medication: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Amoxicillin"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Dosage *</label>
                <input
                  type="text"
                  value={formData.dosage}
                  onChange={(e) =>
                    setFormData({ ...formData, dosage: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 500mg"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Frequency *</label>
                <input
                  type="text"
                  value={formData.frequency}
                  onChange={(e) =>
                    setFormData({ ...formData, frequency: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 3 times daily"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Duration *</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 7 days"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Instructions</label>
              <textarea
                value={formData.instructions}
                onChange={(e) =>
                  setFormData({ ...formData, instructions: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Take with food. Avoid alcohol."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? "Creating..." : "Create Prescription"}
              </button>
              <Link
                href="/dashboard/prescriptions"
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
