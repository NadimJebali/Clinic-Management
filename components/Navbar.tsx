import Link from "next/link";

interface NavbarProps {
  userName?: string;
  userRole?: string;
  showBackToDashboard?: boolean;
}

export default function Navbar({
  userName,
  userRole,
  showBackToDashboard = false,
}: NavbarProps) {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/dashboard"
          className="text-2xl font-bold hover:text-gray-200"
        >
          MedFlow
        </Link>
        <div className="flex items-center gap-4">
          {showBackToDashboard && (
            <Link
              href="/dashboard"
              className="hover:text-gray-200 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Dashboard
            </Link>
          )}
          {userName && <span>{userName}</span>}
          {userRole && (
            <span className="bg-blue-800 px-3 py-1 rounded">{userRole}</span>
          )}
          <Link
            href="/api/auth/signout"
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}
