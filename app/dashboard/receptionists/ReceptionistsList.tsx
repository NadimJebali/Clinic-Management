"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/lib/axios";

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
  const [searchTerm, setSearchTerm] = useState("");

  // Filter receptionists based on search term
  const filteredReceptionists = useMemo(() => {
    if (!searchTerm.trim()) return receptionists;

    const term = searchTerm.toLowerCase();
    return receptionists.filter((receptionist) => {
      return (
        receptionist.user.name.toLowerCase().includes(term) ||
        receptionist.user.email.toLowerCase().includes(term) ||
        receptionist.phone?.toLowerCase().includes(term)
      );
    });
  }, [receptionists, searchTerm]);

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
      await axios.delete(`/receptionists/${id}`);
      router.refresh();
    } catch (error: any) {
      alert(error.response?.data?.error || "Error deleting receptionist");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search receptionists by name, email, or phone..."
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
            Found {filteredReceptionists.length} receptionist(s)
          </p>
        )}
      </div>

      {/* Receptionists Table */}
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
            {filteredReceptionists.map((receptionist) => (
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
                        {deleting === receptionist.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredReceptionists.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm
              ? "No receptionists match your search"
              : "No receptionists found"}
          </div>
        )}
      </div>
    </div>
  );
}
