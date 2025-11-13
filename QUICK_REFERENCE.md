# 🚀 Auth Guard Quick Reference

## Server Components (App Router)

```tsx
import { requireRole, requireAuth, getCurrentUser } from "@/lib/server-auth";

// Require authentication only
await requireAuth();

// Require specific role
await requireRole("ADMIN");

// Require one of multiple roles
await requireRole(["ADMIN", "DOCTOR"]);

// Get current user
const user = await getCurrentUser();

// Check role without redirecting
if (await hasRole("ADMIN")) {
  // Admin-specific logic
}
```

## Client Components

```tsx
'use client';
import { AuthGuard, RoleGate, useAuth, useRole } from '@/lib/auth-guard';

// Wrap entire component
<AuthGuard allowedRoles={['ADMIN', 'DOCTOR']}>
  <YourComponent />
</AuthGuard>

// Conditional rendering
<RoleGate allowedRoles={['ADMIN']} fallback={<div>No access</div>}>
  <AdminButton />
</RoleGate>

// Use hooks
const { user, role, isAuthenticated } = useAuth();
const { hasRole, userRole, isLoading } = useRole(['ADMIN']);

// Higher-order component
export default withAuthGuard(MyComponent, ['ADMIN']);
```

## API Routes

```tsx
import { getCurrentUser, hasRole } from "@/lib/server-auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  if (!(await hasRole("ADMIN"))) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // Handle request...
}
```

## Permissions

```tsx
import { hasPermission } from "@/lib/auth-utils";

const canDelete = hasPermission(userRole as any, "canDeleteRecords");
const canManage = hasPermission(userRole as any, "canManagePatients");

{
  canDelete && <button>Delete</button>;
}
```

## Role Hierarchy

```
ADMIN (4) > DOCTOR (3) > RECEPTIONIST (2) > PATIENT (1)
```

## Common Patterns

### Pattern 1: Server Component with Role Check

```tsx
export default async function Page() {
  const session = await requireRole(["ADMIN", "DOCTOR"]);
  const user = await getCurrentUser();
  // ... rest of page
}
```

### Pattern 2: Client Component with Conditional UI

```tsx
"use client";
export default function Component() {
  const { role } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <RoleGate allowedRoles={["ADMIN"]}>
        <button>Admin Action</button>
      </RoleGate>
    </div>
  );
}
```

### Pattern 3: Mixed Server + Client

```tsx
// Server: Fetch data
async function Page() {
  await requireRole(["ADMIN"]);
  const data = await fetchData();
  return <ClientList data={data} />;
}

// Client: Interactive UI
("use client");
function ClientList({ data }) {
  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>
          {item.name}
          <RoleGate allowedRoles={["ADMIN"]}>
            <button>Delete</button>
          </RoleGate>
        </div>
      ))}
    </div>
  );
}
```

## Files Reference

- `middleware.ts` - Auto-protects all routes
- `lib/auth-guard.tsx` - Client components & hooks
- `lib/server-auth.ts` - Server-side utilities
- `lib/auth-utils.ts` - Shared config
- `components/SessionProvider.tsx` - Session wrapper
- `AUTH_GUARD_README.md` - Full docs
- `examples/auth-guard-examples.tsx` - Examples
