# Authentication System

## Overview

This application uses a simple frontend-only authentication system with Zustand for state management and localStorage for persistence.

## Admin Credentials

The admin credentials are stored in the `.env.local` file:

```
VITE_ADMIN_EMAIL=admin@becutedreams.com
VITE_ADMIN_PASSWORD=BecuteAdmin2024!
```

**⚠️ SECURITY NOTICE:** These are demo credentials for development only. In a production environment, you should implement proper backend authentication with secure password hashing and token management.

## Features

### Authentication Store (`auth.store.ts`)

- **State Management**: Uses Zustand with persistence to localStorage
- **User Roles**: Supports `admin` and `customer` roles
- **Login**: Validates credentials against environment variables for admin, accepts any credentials as customer for demo
- **Logout**: Clears user data and redirects to sign-in
- **Admin Check**: Helper method to verify if current user is admin

### Protected Routes

The `ProtectedRoute` component wraps routes that require authentication:

- Redirects unauthenticated users to `/sign-in`
- Supports `requireAdmin` prop to restrict access to admin users only
- Automatically redirects non-admin users to home page

### Sign In Page

- Form with email/password inputs
- Shows admin credentials banner for easy testing
- Validates credentials via auth store
- Redirects to appropriate page after login:
  - Admin users → `/admin`
  - Regular users → previous page or home
- Displays error messages for failed logins
- Loading state during authentication

### Admin Layout

- Shows current user info in sidebar
- Functional logout button
- Protected by `ProtectedRoute` with `requireAdmin` flag

### Navigation Integration

- Shows different nav items based on auth state:
  - Not logged in: "Sign In" link
  - Logged in as customer: "Logout" button
  - Logged in as admin: "Admin" link + "Logout" button
- Shield icon next to admin link for visual distinction

## Usage

### Accessing Admin Dashboard

1. Navigate to `/sign-in`
2. Use the admin credentials shown on the page:
   - Email: `admin@becutedreams.com`
   - Password: `BecuteAdmin2024!`
3. Click "Sign In"
4. You'll be redirected to `/admin`

### Customer Access

For demo purposes, any email/password combination (other than admin credentials) will log you in as a customer. Customers cannot access the admin dashboard.

### Logging Out

- Click the "Logout" button in the main navigation (desktop/mobile)
- Or click "Logout" in the admin sidebar when in admin area
- You'll be redirected to the sign-in page

## File Structure

```
src/features/auth/
├── auth.store.ts      # Zustand store with auth logic
├── index.ts           # Export barrel
└── README.md          # This file

src/shared/components/auth/
└── ProtectedRoute.tsx # Route protection component

src/pages/
├── SignIn.tsx         # Sign in page with form
└── admin/
    └── AdminLayout.tsx # Admin layout with logout
```

## Future Enhancements

For a production application, consider:

- Backend API integration
- JWT token-based authentication
- Secure password hashing
- Password reset functionality
- Two-factor authentication
- Session timeout
- Account management
- Role-based permissions system
- OAuth integration (Google, GitHub, etc.)
