import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

/**
 * Server-side authentication utilities for Next.js App Router
 */

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Get the current session on the server side
 */
export async function getSession() {
  const session = await getServerSession(authOptions);
  return session as any;
}

/**
 * Get the current user from session
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession();
  return session?.user || null;
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth(callbackUrl?: string) {
  const session = await getSession();

  if (!session) {
    const redirectUrl = callbackUrl
      ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/login";
    redirect(redirectUrl);
  }

  return session;
}

/**
 * Require specific role(s) - redirects if user doesn't have required role
 */
export async function requireRole(
  allowedRoles: string | string[],
  fallbackUrl: string = "/dashboard"
) {
  const session = await requireAuth();
  const userRole = session?.user?.role;

  const rolesArray = Array.isArray(allowedRoles)
    ? allowedRoles
    : [allowedRoles];

  if (!userRole || !rolesArray.includes(userRole)) {
    redirect(`${fallbackUrl}?error=unauthorized`);
  }

  return session;
}

/**
 * Check if user has a specific role (without redirecting)
 */
export async function hasRole(
  requiredRoles: string | string[]
): Promise<boolean> {
  const session = await getSession();
  const userRole = session?.user?.role;

  if (!userRole) return false;

  const rolesArray = Array.isArray(requiredRoles)
    ? requiredRoles
    : [requiredRoles];
  return rolesArray.includes(userRole);
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole("ADMIN");
}

/**
 * Check if user is doctor
 */
export async function isDoctor(): Promise<boolean> {
  return hasRole("DOCTOR");
}

/**
 * Check if user is receptionist
 */
export async function isReceptionist(): Promise<boolean> {
  return hasRole("RECEPTIONIST");
}

/**
 * Check if user is patient
 */
export async function isPatient(): Promise<boolean> {
  return hasRole("PATIENT");
}

/**
 * Get user's role
 */
export async function getUserRole(): Promise<string | null> {
  const session = await getSession();
  return session?.user?.role || null;
}

/**
 * Verify user owns a resource (e.g., a doctor can only access their own appointments)
 */
export async function verifyResourceOwnership(
  resourceOwnerId: string,
  resourceType: "patient" | "doctor" | "receptionist"
): Promise<boolean> {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) return false;

  // Admin can access everything
  if (session?.user?.role === "ADMIN") return true;

  // For other users, check if they own the resource
  // This would typically involve checking the database
  // For now, we'll just check if the IDs match
  return userId === resourceOwnerId;
}
