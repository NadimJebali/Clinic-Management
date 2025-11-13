/**
 * Authentication and Authorization Utilities
 *
 * This file contains helper functions for authentication and authorization
 */

// Role hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY = {
  ADMIN: 4,
  DOCTOR: 3,
  RECEPTIONIST: 2,
  PATIENT: 1,
} as const;

export type UserRole = keyof typeof ROLE_HIERARCHY;

/**
 * Check if a role has higher or equal permissions than another role
 */
export function hasHigherOrEqualRole(
  userRole: UserRole,
  requiredRole: UserRole
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Route access configuration
 */
export const ROUTE_ACCESS = {
  // Dashboard
  "/dashboard": ["ADMIN", "DOCTOR", "RECEPTIONIST", "PATIENT"],

  // Appointments
  "/dashboard/appointments": ["ADMIN", "DOCTOR", "RECEPTIONIST", "PATIENT"],
  "/dashboard/appointments/new": ["ADMIN", "RECEPTIONIST", "PATIENT"],

  // Patients
  "/dashboard/patients": ["ADMIN", "DOCTOR", "RECEPTIONIST"],
  "/dashboard/patients/:id": ["ADMIN", "DOCTOR", "RECEPTIONIST"],
  "/dashboard/patients/new": ["ADMIN", "RECEPTIONIST"],

  // Doctors
  "/dashboard/doctors": ["ADMIN", "RECEPTIONIST", "PATIENT"],
  "/dashboard/doctors/:id": ["ADMIN", "RECEPTIONIST"],
  "/dashboard/doctors/new": ["ADMIN"],

  // Receptionists
  "/dashboard/receptionists": ["ADMIN"],
  "/dashboard/receptionists/:id": ["ADMIN"],
  "/dashboard/receptionists/new": ["ADMIN"],

  // Medical Records
  "/dashboard/medical-records": ["ADMIN", "DOCTOR", "PATIENT"],
  "/dashboard/medical-records/new": ["ADMIN", "DOCTOR"],

  // Prescriptions
  "/dashboard/prescriptions": ["ADMIN", "DOCTOR", "PATIENT"],
  "/dashboard/prescriptions/new": ["ADMIN", "DOCTOR"],
} as const;

/**
 * Check if a user role can access a specific route
 */
export function canAccessRoute(route: string, userRole?: string): boolean {
  if (!userRole) return false;

  // Find exact match or pattern match
  const allowedRoles = ROUTE_ACCESS[route as keyof typeof ROUTE_ACCESS];

  if (!allowedRoles) {
    // Check for dynamic routes
    for (const [routePattern, roles] of Object.entries(ROUTE_ACCESS)) {
      if (
        routePattern.includes(":id") &&
        route.startsWith(routePattern.split(":")[0])
      ) {
        return (roles as readonly string[]).includes(userRole);
      }
    }
    // If no match found, allow by default (let server handle it)
    return true;
  }

  return (allowedRoles as readonly string[]).includes(userRole);
}

/**
 * Get all accessible routes for a user role
 */
export function getAccessibleRoutes(userRole: string): string[] {
  return Object.entries(ROUTE_ACCESS)
    .filter(([_, roles]) => (roles as readonly string[]).includes(userRole))
    .map(([route]) => route);
}

/**
 * Feature flags based on roles
 */
export const ROLE_PERMISSIONS = {
  ADMIN: {
    canManageUsers: true,
    canDeleteRecords: true,
    canAccessAllData: true,
    canModifySettings: true,
    canViewReports: true,
    canManageDoctors: true,
    canManageReceptionists: true,
    canManagePatients: true,
    canUpdateAppointmentStatus: true,
  },
  DOCTOR: {
    canManageUsers: false,
    canDeleteRecords: false,
    canAccessAllData: false,
    canModifySettings: false,
    canViewReports: true,
    canManageDoctors: false,
    canManageReceptionists: false,
    canManagePatients: false,
    canUpdateAppointmentStatus: true,
    canCreateMedicalRecords: true,
    canCreatePrescriptions: true,
  },
  RECEPTIONIST: {
    canManageUsers: false,
    canDeleteRecords: false,
    canAccessAllData: false,
    canModifySettings: false,
    canViewReports: false,
    canManageDoctors: false,
    canManageReceptionists: false,
    canManagePatients: true,
    canUpdateAppointmentStatus: false,
    canCreateAppointments: true,
  },
  PATIENT: {
    canManageUsers: false,
    canDeleteRecords: false,
    canAccessAllData: false,
    canModifySettings: false,
    canViewReports: false,
    canManageDoctors: false,
    canManageReceptionists: false,
    canManagePatients: false,
    canUpdateAppointmentStatus: false,
    canViewOwnData: true,
    canBookAppointments: true,
  },
} as const;

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  userRole: UserRole,
  permission: keyof typeof ROLE_PERMISSIONS.ADMIN
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole] as any;
  return rolePermissions?.[permission] || false;
}

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = ["/", "/login", "/register"];

/**
 * Check if a route is public
 */
export function isPublicRoute(route: string): boolean {
  return PUBLIC_ROUTES.includes(route);
}
