# Admin Delete Functionality

This document describes the delete functionality added for admin users to manage medical records, prescriptions, and appointments.

## Overview

Admin users now have the ability to delete:

- Medical Records
- Prescriptions
- Appointments

## Implementation Details

### API Endpoints

Three new DELETE endpoints have been created with admin-only access control:

1. **Medical Records**: `DELETE /api/medical-records/[id]`

   - Location: `app/api/medical-records/[id]/route.ts`
   - Access: Admin only
   - Action: Deletes a medical record by ID

2. **Prescriptions**: `DELETE /api/prescriptions/[id]`

   - Location: `app/api/prescriptions/[id]/route.ts`
   - Access: Admin only
   - Action: Deletes a prescription by ID

3. **Appointments**: `DELETE /api/appointments/[id]`
   - Location: `app/api/appointments/[id]/route.ts`
   - Access: Admin only
   - Action: Deletes an appointment by ID

### Client Components

Three client components have been created to handle the delete UI:

1. **MedicalRecordsList** (`app/dashboard/medical-records/MedicalRecordsList.tsx`)

   - Displays all medical records in a card layout
   - Shows delete button only for admin users
   - Includes confirmation dialog before deletion
   - Automatically refreshes the page after successful deletion

2. **PrescriptionsList** (`app/dashboard/prescriptions/PrescriptionsList.tsx`)

   - Displays all prescriptions in a card layout
   - Shows delete button only for admin users
   - Includes confirmation dialog before deletion
   - Automatically refreshes the page after successful deletion

3. **AppointmentsList** (`app/dashboard/appointments/AppointmentsList.tsx`)
   - Displays all appointments in a card layout
   - Shows delete button only for admin users
   - Includes confirmation dialog before deletion
   - Color-coded status badges (Scheduled, Confirmed, Completed, Cancelled)
   - Automatically refreshes the page after successful deletion

### Updated Pages

The following pages have been updated to use the new client components:

1. **Medical Records Page** (`app/dashboard/medical-records/page.tsx`)

   - Server component that fetches data
   - Passes data to MedicalRecordsList client component
   - Maintains role-based filtering (patients see their own, doctors see theirs, admins see all)

2. **Prescriptions Page** (`app/dashboard/prescriptions/page.tsx`)

   - Server component that fetches data
   - Passes data to PrescriptionsList client component
   - Maintains role-based filtering (patients see their own, doctors see theirs, admins see all)

3. **Appointments Page** (`app/dashboard/appointments/page.tsx`)
   - Server component that fetches data
   - Passes data to AppointmentsList client component
   - Changed from table layout to card layout for consistency
   - Maintains role-based filtering (patients see their own, doctors see theirs, admins see all)

## User Experience

### For Admin Users

- Delete buttons appear on all medical records, prescriptions, and appointments cards
- Clicking "Delete" triggers a confirmation dialog
- Upon confirmation, the item is deleted and the page refreshes automatically
- The button shows "..." during the deletion process to indicate loading

### For Other Users

- Delete buttons do not appear
- Users can only view records based on their role:
  - **Patients**: See only their own records
  - **Doctors**: See only records they created
  - **Receptionists**: Cannot access medical records or prescriptions

## Security

- All DELETE endpoints verify the user's session
- Only users with the "ADMIN" role can delete records
- Unauthorized attempts return a 403 Forbidden response
- Database cascading is configured in Prisma schema to maintain referential integrity

## Testing

To test the delete functionality:

1. Log in as an admin user (email: admin@medflow.com)
2. Navigate to any of these pages:
   - `/dashboard/medical-records`
   - `/dashboard/prescriptions`
   - `/dashboard/appointments`
3. Click the "Delete" button on any card
4. Confirm the deletion in the dialog
5. The record should be deleted and the page should refresh

## Technical Notes

- Uses Next.js 15+ with Server and Client Components pattern
- Implements optimistic UI updates with `router.refresh()`
- Uses React hooks (`useState`, `useRouter`) for state management
- TypeScript interfaces ensure type safety
- Confirmation dialogs prevent accidental deletions
