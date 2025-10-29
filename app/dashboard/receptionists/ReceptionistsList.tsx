"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Receptionist {
  id: string;
  phone?: string | null;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
}

export default function ReceptionistsList({
  receptionists,
  userRole,
}: {
  receptionists: Receptionist[];
  userRole: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (
      !confirm(
        `Are you sure you want to delete receptionist ${name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeleting(id);

    try {
      const response = await fetch(`/api/receptionists/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to delete receptionist");
      }
    } catch (error) {
      alert("Error deleting receptionist");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="bg-white text-gray-600 rounded-lg shadow overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Joined Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {receptionists.map((receptionist) => (
            <tr key={receptionist.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {receptionist.user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {receptionist.user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {receptionist.phone || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(receptionist.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/receptionists/${receptionist.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block"
                  >
                    View Profile
                  </Link>
                  {userRole === "ADMIN" && (
                    <button
                      onClick={() =>
                        handleDelete(receptionist.id, receptionist.user.name)
                      }
                      disabled={deleting === receptionist.id}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
                    >
                      {deleting === receptionist.id ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {receptionists.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No receptionists found
        </div>
      )}
    </div>
  );
}
