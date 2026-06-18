# Authentication System

## Overview

This application is ready for backend authentication integration. The authentication system uses Zustand for state management and localStorage for persistence.

## Setup for Backend Integration

When you integrate with a backend (like Supabase), you'll need to:

1. Add your backend configuration to `.env.local`:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. Update the `login` method in `auth.store.ts` to call your backend API

3. Implement proper password hashing and token management

## Features

### Authentication Store (`auth.store.ts`)

- **State Management**: Uses Zustand with persistence to localStorage
- **User Roles**: Supports `admin` and `customer` roles
- **Login**: Ready for backend authentication integration
- **Logout**: Clears user data and redirects to sign-in
- **Registration**: Customer registration with validation
- **Admin Check**: Helper method to verify if current user is admin

### Protected Routes

The `ProtectedRoute` component wraps routes that require authentication:

- Redirects unauthenticated users to `/sign-in`
- Supports `requireAdmin` prop to restrict access to admin users only
- Automatically redirects non-admin users to home page

### Sign In Page

- Form with email/password inputs
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

### User Registration

1. Navigate to `/sign-up`
2. Fill in the registration form with your details
3. Submit the form to create a customer account
4. You'll be automatically logged in and redirected

### Signing In

1. Navigate to `/sign-in`
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected based on your role

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
├── SignUp.tsx         # Registration page
└── admin/
    └── AdminLayout.tsx # Admin layout with logout
```

## Backend Integration Checklist

For production deployment with a real backend:

- [ ] Set up authentication backend (Supabase, Firebase, custom API)
- [ ] Add backend configuration to environment variables
- [ ] Update login method to call backend API
- [ ] Implement secure password hashing on backend
- [ ] Add JWT token handling
- [ ] Implement password reset functionality
- [ ] Add session management and timeout
- [ ] Set up role-based permissions
- [ ] Add email verification
- [ ] Consider OAuth integration (Google, GitHub, etc.)
- [ ] Implement proper error handling
- [ ] Add rate limiting for login attempts
