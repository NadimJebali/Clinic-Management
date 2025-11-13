import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define route access rules
const routeAccess: Record<string, string[]> = {
  "/dashboard": ["ADMIN", "DOCTOR", "RECEPTIONIST", "PATIENT"],
  "/dashboard/appointments": ["ADMIN", "DOCTOR", "RECEPTIONIST", "PATIENT"],
  "/dashboard/appointments/new": ["ADMIN", "RECEPTIONIST", "PATIENT"],
  "/dashboard/patients": ["ADMIN", "DOCTOR", "RECEPTIONIST"],
  "/dashboard/patients/new": ["ADMIN", "RECEPTIONIST"],
  "/dashboard/doctors": ["ADMIN", "RECEPTIONIST", "PATIENT"],
  "/dashboard/doctors/new": ["ADMIN"],
  "/dashboard/receptionists": ["ADMIN"],
  "/dashboard/receptionists/new": ["ADMIN"],
  "/dashboard/medical-records": ["ADMIN", "DOCTOR", "PATIENT"],
  "/dashboard/medical-records/new": ["ADMIN", "DOCTOR"],
  "/dashboard/prescriptions": ["ADMIN", "DOCTOR", "PATIENT"],
  "/dashboard/prescriptions/new": ["ADMIN", "DOCTOR"],
};

// Public routes that don't require authentication
const publicRoutes = ["/", "/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow API routes (they handle their own auth)
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect to login if not authenticated
  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Check role-based access for protected routes
  const userRole = token.role as string;

  // Find matching route pattern
  let allowedRoles: string[] | undefined;

  // Direct match
  if (routeAccess[pathname]) {
    allowedRoles = routeAccess[pathname];
  } else {
    // Check for dynamic routes (e.g., /dashboard/patients/[id])
    for (const [route, roles] of Object.entries(routeAccess)) {
      if (pathname.startsWith(route.split("[")[0])) {
        allowedRoles = roles;
        break;
      }
    }
  }

  // If route has role restrictions and user doesn't have access
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to dashboard with error message
    const url = new URL("/dashboard", request.url);
    url.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)",
  ],
};
