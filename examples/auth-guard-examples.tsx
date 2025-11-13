/**
 * Example: Converting existing pages to use Auth Guards
 *
 * This file shows examples of how to add authentication guards to your existing pages
 */

// ============================================================================
// EXAMPLE 1: Server Component with Role Protection
// ============================================================================

// Before:
/*
export default async function DoctorsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }
  
  // ... rest of code
}
*/

// After (much cleaner!):
import { requireRole } from "@/lib/server-auth";

async function DoctorsPageNew() {
  await requireRole(["ADMIN", "RECEPTIONIST", "PATIENT"]);

  // User is authenticated and has required role
  // Continue with page logic
  return <div>Doctors Page</div>;
}

// ============================================================================
// EXAMPLE 2: Client Component with AuthGuard
// ============================================================================

// Before:
/*
'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AppointmentsList() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  
  if (!session) {
    router.push('/login');
    return null;
  }
  
  if (!['ADMIN', 'DOCTOR'].includes(session.user.role)) {
    router.push('/dashboard');
    return null;
  }
  
  // ... rest of code
}
*/

// After:
import { AuthGuard } from "@/lib/auth-guard";

function AppointmentsListNew() {
  return (
    <AuthGuard allowedRoles={["ADMIN", "DOCTOR"]}>
      {/* Component content */}
      <div>Appointments List</div>
    </AuthGuard>
  );
}

// ============================================================================
// EXAMPLE 3: Conditional Rendering Based on Role
// ============================================================================

// Before:
/*
function DashboardNav() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';
  const isDoctor = session?.user?.role === 'DOCTOR';
  
  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
      {isAdmin && <Link href="/dashboard/doctors/new">Add Doctor</Link>}
      {(isAdmin || isDoctor) && <Link href="/dashboard/patients">Patients</Link>}
    </nav>
  );
}
*/

// After:
import { RoleGate } from "@/lib/auth-guard";

function DashboardNavNew() {
  return (
    <nav>
      <a href="/dashboard">Dashboard</a>

      <RoleGate allowedRoles={["ADMIN"]}>
        <a href="/dashboard/doctors/new">Add Doctor</a>
      </RoleGate>

      <RoleGate allowedRoles={["ADMIN", "DOCTOR"]}>
        <a href="/dashboard/patients">Patients</a>
      </RoleGate>
    </nav>
  );
}

// ============================================================================
// EXAMPLE 4: Using Hooks for Complex Logic
// ============================================================================

import { useAuth, useRole } from "@/lib/auth-guard";

function ComplexComponent() {
  const { user, role, isAuthenticated } = useAuth();
  const { hasRole } = useRole(["ADMIN", "DOCTOR"]);

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <p>Your role: {role}</p>

      {hasRole && <button>Admin/Doctor Only Action</button>}
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: API Route Protection
// ============================================================================

// Before:
/*
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  if (session.user.role !== 'ADMIN') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // ... handle request
}
*/

// After:
import { getCurrentUser, hasRole } from "@/lib/server-auth";

async function POSTNew(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await hasRole("ADMIN"))) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // Handle request
  return Response.json({ success: true });
}

// ============================================================================
// EXAMPLE 6: Permission-Based Features
// ============================================================================

import { hasPermission } from "@/lib/auth-utils";

function PatientActions({ userRole }: { userRole: string }) {
  const canDelete = hasPermission(userRole as any, "canDeleteRecords");
  const canManage = hasPermission(userRole as any, "canManagePatients");

  return (
    <div>
      {canManage && <button>Edit Patient</button>}
      {canDelete && <button>Delete Patient</button>}
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: Higher-Order Component
// ============================================================================

import { withAuthGuard } from "@/lib/auth-guard";

// Regular component
function AdminPanel() {
  return <div>Admin Only Panel</div>;
}

// Export protected version
export const ProtectedAdminPanel = withAuthGuard(AdminPanel, ["ADMIN"]);

// Usage in another file:
// import { ProtectedAdminPanel } from './AdminPanel';
// <ProtectedAdminPanel />

// ============================================================================
// EXAMPLE 8: Update Existing Dashboard Page
// ============================================================================

// app/dashboard/doctors/page.tsx - BEFORE
/*
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function DoctorsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  if (!['ADMIN', 'RECEPTIONIST', 'PATIENT'].includes((session as any).user.role)) {
    redirect('/dashboard');
  }

  // ... rest of page
}
*/

// app/dashboard/doctors/page.tsx - AFTER
import { requireRole } from "@/lib/server-auth";
import { prisma } from "@/lib/prisma";

async function DoctorsPageUpdated() {
  // Single line replaces all the auth checks above!
  const session = await requireRole(["ADMIN", "RECEPTIONIST", "PATIENT"]);

  const doctors = await prisma.doctor.findMany({
    include: { user: true },
  });

  return (
    <div>
      <h1>Doctors</h1>
      {/* ... rest of page */}
    </div>
  );
}

// ============================================================================
// EXAMPLE 9: Checking Ownership (Doctor accessing own data)
// ============================================================================

import { getCurrentUser } from "@/lib/server-auth";

async function MyAppointmentsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null; // Will be handled by middleware
  }

  // Get doctor's profile
  const doctor = await prisma.doctor.findFirst({
    where: { userId: user.id },
  });

  if (!doctor) {
    return <div>Doctor profile not found</div>;
  }

  // Get only this doctor's appointments
  const appointments = await prisma.appointment.findMany({
    where: { doctorId: doctor.id },
  });

  return <div>My Appointments</div>;
}

// ============================================================================
// EXAMPLE 10: Mixed Server and Client Protection
// ============================================================================

// Server component verifies role
async function AppointmentsPage() {
  await requireRole(["ADMIN", "DOCTOR", "RECEPTIONIST"]);

  const appointments = await prisma.appointment.findMany();

  // Pass to client component
  return <AppointmentsList appointments={appointments} />;
}

// Client component with additional UI-level protection
function AppointmentsListComponent({ appointments }: any) {
  return (
    <div>
      {appointments.map((apt: any) => (
        <div key={apt.id}>
          {apt.patient.name}

          {/* Only show delete button to admins */}
          <RoleGate allowedRoles={["ADMIN"]}>
            <button>Delete</button>
          </RoleGate>
        </div>
      ))}
    </div>
  );
}
