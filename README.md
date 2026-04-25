# it3030-paf-2026-smart-campus-group5.1

## Quick View (For GitHub / Grading)

### Submission Highlights

- Google OAuth authentication integrated end-to-end
- Backend-enforced role-based access (`USER`, `ADMIN`, `TECHNICIAN`)
- Facility booking with approval workflow
- Ticketing workflow with assignment and status management
- Real-time style notification flow with unread bell highlighting

### Member 4 Scope Coverage (Security + Communication Layer)

- Authentication:
  - Google OAuth login flow
  - User upsert on OAuth login
  - Default new user role = `USER`
- Authorization:
  - Role-aware backend access controls for admin/technician actions
  - Role-aware frontend pages and navigation visibility
- Notifications:
  - Booking approved/rejected notifications
  - New booking request notifications to admins
  - New ticket notifications to admins
  - Technician assignment notifications (technician + ticket owner)
  - Ticket status change notifications (owner + admin visibility for technician updates)
  - New comment notifications (participants + admins)
  - Mark-as-read and delete support
  - Category filters and ON/OFF visibility settings in UI

### Demo Flow (Suggested)

1. Login with Google as a `USER`
2. Create booking and create ticket
3. Login as `ADMIN` and assign technician / approve or reject booking
4. Login as `TECHNICIAN` and update ticket status
5. Return to `USER` and verify new notifications
6. Verify bell icon highlight and unread badge
