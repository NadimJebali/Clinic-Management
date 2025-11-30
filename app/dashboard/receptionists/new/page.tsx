"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/lib/axios";
import Navbar from "@/components/Navbar";

export default function NewReceptionistPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clinics, setClinics] = useState<any[]>([]);

  useEffect(() => {
    async function loadClinics() {
      try {
        const res = await axios.get("/clinics");
        setClinics(res.data.clinics || []);
      } catch (err) {
        console.error("Failed to load clinics:", err);
      }
    }
    loadClinics();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const clinicId = formData.get("clinicId");
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      phone: formData.get("phone"),
      clinicId: clinicId || null,
    };

    try {
      await axios.post("/receptionists", data);
      router.push("/dashboard/receptionists");
      router.refresh();
    } catch (error: any) {
      setError(
        error.response?.data?.error || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar showBackToDashboard={true} />

      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white text-gray-600 rounded-lg shadow p-6"
          >
            <div className="space-y-4">
              <h1 className="text-2xl text-black font-bold mb-6">
                Add New Receptionist
              </h1>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Sarah Johnson"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="receptionist@medflow.com"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Minimum 6 characters"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1234567890"
                />
              </div>

              {/* Clinic */}
              <div>
                <label
                  htmlFor="clinicId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Clinic
                </label>
                <select
                  id="clinicId"
                  name="clinicId"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No Clinic</option>
                  {clinics.map((clinic) => (
                    <option key={clinic.id} value={clinic.id}>
                      {clinic.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium"
              >
                {loading ? "Creating..." : "Create Receptionist"}
              </button>
              <Link
                href="/dashboard/receptionists"
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 text-center font-medium"
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
