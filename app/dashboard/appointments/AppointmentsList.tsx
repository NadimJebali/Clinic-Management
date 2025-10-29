"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Appointment {
  id: string;
  dateTime: Date;
  reason?: string;
  status: string;
  notes?: string;
  patient: { user: { name: string } };
  doctor: { user: { name: string }; specialization: string };
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

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    setDeleting(id);

    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to delete appointment");
      }
    } catch (error) {
      alert("Error deleting appointment");
    } finally {
      setDeleting(null);
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-2">
            <span
              className={`px-2 py-1 rounded text-xs ${getStatusColor(
                appointment.status
              )}`}
            >
              {appointment.status}
            </span>
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
              <span>{appointment.doctor.specialization}</span>
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

      {appointments.length === 0 && (
        <div className="col-span-3 bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No appointments found
        </div>
      )}
    </div>
  );
}
