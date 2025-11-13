"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
  fallbackUrl?: string;
  loadingComponent?: ReactNode;
}

/**
 * Client-side authentication guard component
 * Wraps components that require authentication and/or specific roles
 */
export function AuthGuard({
  children,
  allowedRoles,
  fallbackUrl = "/login",
  loadingComponent,
}: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not authenticated, redirect to login with callback
    if (status === "unauthenticated") {
      const callbackUrl = encodeURIComponent(pathname || "/dashboard");
      router.push(`${fallbackUrl}?callbackUrl=${callbackUrl}`);
      return;
    }

    // If authenticated but doesn't have required role
    if (
      status === "authenticated" &&
      allowedRoles &&
      allowedRoles.length > 0
    ) {
      const userRole = (session as any)?.user?.role;
      if (!userRole || !allowedRoles.includes(userRole)) {
        router.push("/dashboard?error=unauthorized");
      }
    }
  }, [status, session, router, pathname, allowedRoles, fallbackUrl]);

  // Show loading state
  if (status === "loading") {
    return (
      <>
        {loadingComponent || (
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 text-lg">Loading...</p>
            </div>
          </div>
        )}
      </>
    );
  }

  // If unauthenticated, show nothing (redirecting)
  if (status === "unauthenticated") {
    return null;
  }

  // If authenticated, check role
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (session as any)?.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return null; // Redirecting
    }
  }

  // User is authenticated and authorized
  return <>{children}</>;
}

/**
 * Higher-order component for role-based access control
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: string[]
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard allowedRoles={allowedRoles}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}

/**
 * Hook to check if user has specific role(s)
 */
export function useRole(requiredRoles?: string | string[]): {
  hasRole: boolean;
  userRole: string | null;
  isLoading: boolean;
} {
  const { data: session, status } = useSession();
  const userRole = (session as any)?.user?.role || null;

  if (status === "loading") {
    return { hasRole: false, userRole: null, isLoading: true };
  }

  if (!requiredRoles) {
    return { hasRole: true, userRole, isLoading: false };
  }

  const rolesArray = Array.isArray(requiredRoles)
    ? requiredRoles
    : [requiredRoles];

  const hasRole = userRole ? rolesArray.includes(userRole) : false;

  return { hasRole, userRole, isLoading: false };
}

/**
 * Hook to check if user is authenticated
 */
export function useAuth() {
  const { data: session, status } = useSession();
  
  return {
    user: (session as any)?.user || null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    role: (session as any)?.user?.role || null,
  };
}

/**
 * Component to conditionally render based on role
 */
export function RoleGate({
  children,
  allowedRoles,
  fallback,
}: {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}) {
  const { hasRole, isLoading } = useRole(allowedRoles);

  if (isLoading) {
    return null;
  }

  if (!hasRole) {
    return <>{fallback || null}</>;
  }

  return <>{children}</>;
}
