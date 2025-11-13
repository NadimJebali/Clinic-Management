# Authentication Guard System

This directory contains a comprehensive authentication and authorization system for the Clinic Management application.

## Files Overview

### 1. `middleware.ts` (Root Level)

Server-side middleware that runs before every request to protect routes.

**Features:**

- ✅ Checks authentication status
- ✅ Role-based access control
- ✅ Automatic redirect to login for unauthenticated users
- ✅ Blocks unauthorized access based on user roles

### 2. `lib/auth-guard.tsx`

Client-side authentication guard components and hooks.

**Components:**

- `AuthGuard` - Wraps components requiring authentication
- `RoleGate` - Conditionally renders based on role
- `withAuthGuard` - HOC for protecting components

**Hooks:**

- `useAuth()` - Get current user and auth status
- `useRole()` - Check if user has specific role(s)

### 3. `lib/server-auth.ts`

Server-side authentication utilities for App Router pages.

**Functions:**

- `requireAuth()` - Require authentication (redirects if not)
- `requireRole()` - Require specific role(s)
- `getCurrentUser()` - Get current user
- `hasRole()` - Check role without redirecting
- `isAdmin()`, `isDoctor()`, `isReceptionist()`, `isPatient()` - Role checkers

### 4. `lib/auth-utils.ts`

Shared authentication utilities and constants.

**Features:**

- Role hierarchy system
- Route access configuration
- Permission system
- Helper functions

### 5. `components/SessionProvider.tsx`

Client-side session provider wrapper for Next Auth.

## Usage Examples

### Server Components (App Router)

```tsx
// app/dashboard/doctors/page.tsx
import { requireRole } from "@/lib/server-auth";

export default async function DoctorsPage() {
  // Only allow ADMIN, RECEPTIONIST, and PATIENT roles
  await requireRole(["ADMIN", "RECEPTIONIST", "PATIENT"]);

  return <div>Doctors Page</div>;
}
```

```tsx
// app/dashboard/admin/page.tsx
import { requireRole, getCurrentUser } from "@/lib/server-auth";

export default async function AdminPage() {
  // Only admins can access
  const session = await requireRole("ADMIN");
  const user = await getCurrentUser();

  return <div>Welcome {user?.name}</div>;
}
```

### Client Components

```tsx
// components/ProtectedComponent.tsx
"use client";

import { AuthGuard, RoleGate, useAuth } from "@/lib/auth-guard";

export function ProtectedComponent() {
  return (
    <AuthGuard allowedRoles={["ADMIN", "DOCTOR"]}>
      <div>Only admins and doctors can see this</div>
    </AuthGuard>
  );
}

export function ConditionalComponent() {
  const { user, role, isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated && <p>Welcome {user?.name}</p>}

      <RoleGate
        allowedRoles={["ADMIN"]}
        fallback={<p>Admin only content hidden</p>}
      >
        <button>Delete Record</button>
      </RoleGate>
    </div>
  );
}
```

### Higher-Order Component

```tsx
import { withAuthGuard } from "@/lib/auth-guard";

function MyComponent() {
  return <div>Protected content</div>;
}

export default withAuthGuard(MyComponent, ["ADMIN", "DOCTOR"]);
```

### Using Hooks

```tsx
"use client";

import { useRole, useAuth } from "@/lib/auth-guard";

export function MyComponent() {
  const { hasRole, userRole, isLoading } = useRole(["ADMIN", "DOCTOR"]);
  const { user, isAuthenticated } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!hasRole) {
    return <div>Access denied</div>;
  }

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <p>Your role: {userRole}</p>
    </div>
  );
}
```

### Using Permissions

```tsx
import { hasPermission, ROLE_PERMISSIONS } from "@/lib/auth-utils";

function AdminButton({ userRole }: { userRole: string }) {
  const canDelete = hasPermission(userRole as any, "canDeleteRecords");

  if (!canDelete) return null;

  return <button>Delete</button>;
}
```

## Setup Instructions

### 1. Update Root Layout

Add the SessionProvider to your root layout:

```tsx
// app/layout.tsx
import { SessionProvider } from "@/components/SessionProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

### 2. Environment Variables

Ensure you have the NextAuth secret in your `.env` file:

```env
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### 3. Middleware Configuration

The middleware is already set up in `middleware.ts` at the root level. It will automatically:

- Protect all routes except public ones
- Check authentication
- Verify role-based access
- Redirect unauthorized users

## Role Permissions

### ADMIN

- Full access to all features
- Can manage users, doctors, receptionists, patients
- Can delete records
- Can modify system settings
- Can view all reports

### DOCTOR

- Can view and create medical records
- Can create prescriptions
- Can update appointment status
- Can view patients assigned to them
- Can view reports

### RECEPTIONIST

- Can manage patients
- Can create appointments
- Can view doctors list
- Limited access to medical data

### PATIENT

- Can view own appointments
- Can book appointments
- Can view own medical records and prescriptions
- Cannot access other patients' data

## Route Protection

Routes are automatically protected by middleware. Configuration in `lib/auth-utils.ts`:

```typescript
export const ROUTE_ACCESS = {
  "/dashboard": ["ADMIN", "DOCTOR", "RECEPTIONIST", "PATIENT"],
  "/dashboard/doctors/new": ["ADMIN"],
  "/dashboard/patients": ["ADMIN", "DOCTOR", "RECEPTIONIST"],
  // ... more routes
};
```

## API Route Protection

For API routes, use the server auth functions:

```typescript
// app/api/doctors/route.ts
import { getCurrentUser, hasRole } from "@/lib/server-auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await hasRole("ADMIN"))) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // ... handle request
}
```

## Testing

To test different roles:

1. Login with different user accounts
2. Try accessing protected routes
3. Verify redirects work correctly
4. Check permission-based UI elements

## Security Best Practices

1. ✅ Always validate on the server (middleware + server components)
2. ✅ Use client-side guards for UX only
3. ✅ Don't expose sensitive data in client components
4. ✅ Validate permissions in API routes
5. ✅ Use environment variables for secrets
6. ✅ Implement proper session timeout
7. ✅ Log authentication attempts

## Troubleshooting

### "Unauthorized" redirects

- Check if user is logged in
- Verify session is active
- Check role permissions in `lib/auth-utils.ts`

### Middleware not working

- Ensure `middleware.ts` is at root level
- Check matcher configuration
- Verify NextAuth configuration

### Client hooks not working

- Ensure SessionProvider is in root layout
- Check if component is marked 'use client'
- Verify next-auth/react is installed
