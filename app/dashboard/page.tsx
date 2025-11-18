import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user.role;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">MedFlow</h1>
          <div className="flex items-center gap-4">
            <span>{session.user.name}</span>
            <span className="bg-blue-800 px-3 py-1 rounded">{role}</span>
            <Link
              href="/api/auth/signout"
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </Link>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto p-6">
        <h2 className="text-3xl text-black font-bold mb-6">Dashboard</h2>

        {/* Admin Dashboard */}
        {role === "ADMIN" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Manage Clinics"
              description="View and manage all clinics"
              link="/dashboard/clinics"
            />
            <DashboardCard
              title="Manage Patients"
              description="View and manage all patients"
              link="/dashboard/patients"
            />
            <DashboardCard
              title="Manage Doctors"
              description="View and manage doctors"
              link="/dashboard/doctors"
            />
            <DashboardCard
              title="Manage Receptionists"
              description="View and manage receptionists"
              link="/dashboard/receptionists"
            />
            <DashboardCard
              title="Appointments"
              description="View all appointments"
              link="/dashboard/appointments"
            />
            <DashboardCard
              title="Medical Records"
              description="View all medical records"
              link="/dashboard/medical-records"
            />
            <DashboardCard
              title="Prescriptions"
              description="View all prescriptions"
              link="/dashboard/prescriptions"
            />
          </div>
        )}

        {/* Doctor Dashboard */}
        {role === "DOCTOR" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Clinics"
              description="View clinic information"
              link="/dashboard/clinics"
            />
            <DashboardCard
              title="My Appointments"
              description="View your scheduled appointments"
              link="/dashboard/appointments"
            />
            <DashboardCard
              title="Patients"
              description="View patient information"
              link="/dashboard/patients"
            />
            <DashboardCard
              title="Medical Records"
              description="Manage medical records"
              link="/dashboard/medical-records"
            />
            <DashboardCard
              title="Prescriptions"
              description="Create prescriptions"
              link="/dashboard/prescriptions"
            />
          </div>
        )}

        {/* Receptionist Dashboard */}
        {role === "RECEPTIONIST" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Clinics"
              description="View clinic information"
              link="/dashboard/clinics"
            />
            <DashboardCard
              title="Book Appointment"
              description="Schedule new appointment"
              link="/dashboard/appointments/new"
            />
            <DashboardCard
              title="View Appointments"
              description="Manage all appointments"
              link="/dashboard/appointments"
            />
            <DashboardCard
              title="Register Patient"
              description="Add new patient"
              link="/dashboard/patients/new"
            />
            <DashboardCard
              title="Patient List"
              description="View all patients"
              link="/dashboard/patients"
            />
          </div>
        )}

        {/* Patient Dashboard */}
        {role === "PATIENT" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Clinics"
              description="View clinic information"
              link="/dashboard/clinics"
            />
            <DashboardCard
              title="My Appointments"
              description="View your appointments"
              link="/dashboard/appointments"
            />
            <DashboardCard
              title="Book Appointment"
              description="Schedule new appointment"
              link="/dashboard/appointments/new"
            />
            <DashboardCard
              title="Medical Records"
              description="View your medical history"
              link="/dashboard/medical-records"
            />
            <DashboardCard
              title="Prescriptions"
              description="View your prescriptions"
              link="/dashboard/prescriptions"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link: string;
}) {
  return (
    <Link
      href={link}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
    >
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
}
