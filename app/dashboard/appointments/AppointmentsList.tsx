"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

interface Appointment {
  id: string;
  dateTime: Date;
  reason?: string;
  status: string;
  notes?: string;
  patient: { user: { name: string } };
  doctor: { user: { name: string }; specialty: string };
}

export default function AppointmentsList({
  appointments,
  userRole,
}: {
  appointments: Appointment[];
  userRole: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter appointments based on search term
  const filteredAppointments = useMemo(() => {
    if (!searchTerm.trim()) return appointments;

    const term = searchTerm.toLowerCase();
    return appointments.filter((appointment) => {
      return (
        appointment.patient.user.name.toLowerCase().includes(term) ||
        appointment.doctor.user.name.toLowerCase().includes(term) ||
        appointment.doctor.specialty.toLowerCase().includes(term) ||
        appointment.status.toLowerCase().includes(term) ||
        appointment.reason?.toLowerCase().includes(term) ||
        new Date(appointment.dateTime).toLocaleDateString().includes(term)
      );
    });
  }, [appointments, searchTerm]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    setDeleting(id);

    try {
      await axios.delete(`/appointments/${id}`);
      router.refresh();
    } catch (error: any) {
      alert(error.response?.data?.error || "Error deleting appointment");
    } finally {
      setDeleting(null);
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    setUpdatingStatus(id);

    try {
      await axios.patch(`/appointments/${id}`, { status: newStatus });
      router.refresh();
    } catch (error: any) {
      alert(
        `Failed to update appointment status: ${
          error.response?.data?.error || "Unknown error"
        }`
      );
    } finally {
      setUpdatingStatus(null);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  const statuses = ["SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED"];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search appointments by patient, doctor, specialty, status, or date..."
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
            Found {filteredAppointments.length} appointment(s)
          </p>
        )}
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppointments.map((appointment) => (
          <div key={appointment.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-2">
              {userRole === "DOCTOR" || userRole === "ADMIN" ? (
                <select
                  value={appointment.status}
                  onChange={(e) =>
                    handleStatusChange(appointment.id, e.target.value)
                  }
                  disabled={updatingStatus === appointment.id}
                  className={`px-2 py-1 rounded text-xs font-medium cursor-pointer border border-gray-300 ${getStatusColor(
                    appointment.status
                  )} disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              ) : (
                <span
                  className={`px-2 py-1 rounded text-xs ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {appointment.status}
                </span>
              )}
              {userRole === "ADMIN" && (
                <button
                  onClick={() => handleDelete(appointment.id)}
                  disabled={deleting === appointment.id}
                  className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700 disabled:bg-gray-400"
                >
                  {deleting === appointment.id ? "..." : "Delete"}
                </button>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Date & Time:</span>{" "}
                <span className="font-semibold">
                  {new Date(appointment.dateTime).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Patient:</span>{" "}
                <span className="font-semibold">
                  {appointment.patient.user.name}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Doctor:</span>{" "}
                <span className="font-semibold">
                  {appointment.doctor.user.name}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Specialization:</span>{" "}
                <span>{appointment.doctor.specialty}</span>
              </div>
              {appointment.reason && (
                <div>
                  <span className="text-gray-600">Reason:</span>
                  <p className="mt-1">{appointment.reason}</p>
                </div>
              )}
              {appointment.notes && (
                <div>
                  <span className="text-gray-600">Notes:</span>
                  <p className="mt-1">{appointment.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredAppointments.length === 0 && (
          <div className="col-span-3 bg-white rounded-lg shadow p-8 text-center text-gray-500">
            {searchTerm
              ? "No appointments match your search"
              : "No appointments found"}
          </div>
        )}
      </div>
    </div>
  );
}
