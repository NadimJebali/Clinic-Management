"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/lib/axios";
import Navbar from "@/components/Navbar";

export default function EditDoctorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [doctorId, setDoctorId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [clinics, setClinics] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialty: "",
    licenseNumber: "",
    phone: "",
    clinicId: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const resolvedParams = await params;
        setDoctorId(resolvedParams.id);

        // Fetch doctor data
        const doctorRes = await axios.get(`/doctors/${resolvedParams.id}`);
        const doctor = doctorRes.data.doctor;

        setFormData({
          name: doctor.user.name || "",
          email: doctor.user.email || "",
          specialty: doctor.specialty || "",
          licenseNumber: doctor.licenseNumber || "",
          phone: doctor.phone || "",
          clinicId: doctor.clinicId || "",
        });

        // Fetch clinics
        const clinicsRes = await axios.get("/clinics");
        setClinics(clinicsRes.data.clinics || []);

        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load doctor data");
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
      await axios.patch(`/doctors/${doctorId}`, {
        name: formData.name,
        email: formData.email,
        specialty: formData.specialty,
        licenseNumber: formData.licenseNumber,
        phone: formData.phone,
        clinicId: formData.clinicId || null,
      });

      router.push(`/dashboard/doctors/${doctorId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update doctor");
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
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Doctor</h1>

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
              <label className="block text-gray-700 mb-2">Specialty *</label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                License Number *
              </label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) =>
                  setFormData({ ...formData, licenseNumber: e.target.value })
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
                {submitting ? "Updating..." : "Update Doctor"}
              </button>
              <Link
                href={`/dashboard/doctors/${doctorId}`}
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
