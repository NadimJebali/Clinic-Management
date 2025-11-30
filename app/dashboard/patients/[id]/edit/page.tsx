"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/lib/axios";
import Navbar from "@/components/Navbar";

export default function EditPatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [patientId, setPatientId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [clinics, setClinics] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    clinicId: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const resolvedParams = await params;
        setPatientId(resolvedParams.id);

        // Fetch patient data
        const patientRes = await axios.get(`/patients/${resolvedParams.id}`);
        const patient = patientRes.data.patient;

        setFormData({
          name: patient.user.name || "",
          email: patient.user.email || "",
          phone: patient.phone || "",
          address: patient.address || "",
          dateOfBirth: patient.dateOfBirth
            ? new Date(patient.dateOfBirth).toISOString().split("T")[0]
            : "",
          gender: patient.gender || "",
          bloodType: patient.bloodType || "",
          clinicId: patient.clinicId || "",
        });

        // Fetch clinics
        const clinicsRes = await axios.get("/clinics");
        setClinics(clinicsRes.data.clinics || []);

        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load patient data");
        setLoading(false);
      }
    }

    loadData();
  }, [params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await axios.patch(`/patients/${patientId}`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender,
        bloodType: formData.bloodType,
        clinicId: formData.clinicId || null,
      });

      router.push(`/dashboard/patients/${patientId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update patient");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar showBackToDashboard={true} />

      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Edit Patient
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
            <div>
              <label className="block text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Blood Type</label>
              <select
                value={formData.bloodType}
                onChange={(e) =>
                  setFormData({ ...formData, bloodType: e.target.value })
                }
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Clinic</label>
              <select
                value={formData.clinicId}
                onChange={(e) =>
                  setFormData({ ...formData, clinicId: e.target.value })
                }
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No Clinic</option>
                {clinics.map((clinic) => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {submitting ? "Updating..." : "Update Patient"}
              </button>
              <Link
                href={`/dashboard/patients/${patientId}`}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 text-center"
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
