import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br text-gray-600 from-blue-50 to-blue-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">MedFlow</h1>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-6 py-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Welcome to MedFlow
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Modern clinic management system for doctors, patients, and staff
          </p>
          <p className="text-lg text-gray-600 mb-12">
            Manage appointments, medical records, prescriptions, and more - all
            in one place
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-semibold"
          >
            Get Started
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">👨‍⚕️</div>
            <h3 className="text-xl font-semibold mb-2">For Doctors</h3>
            <p className="text-gray-600">
              Manage your patients, appointments, and medical records
              efficiently
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🏥</div>
            <h3 className="text-xl font-semibold mb-2">For Clinics</h3>
            <p className="text-gray-600">
              Complete clinic management with staff and resource tracking
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">👤</div>
            <h3 className="text-xl font-semibold mb-2">For Patients</h3>
            <p className="text-gray-600">
              Book appointments, view records, and access prescriptions online
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
            <p className="text-gray-600">
              Simple appointment booking and calendar management
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
