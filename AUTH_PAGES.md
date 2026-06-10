# Authentication Pages

## Overview

Beautiful, luxury-styled authentication pages for Becute Dreams that match the brand's soft, elegant aesthetic.

## Pages Created

### 1. Sign Up (`/sign-up`)

A comprehensive registration page featuring:

- Full name input field
- Email input field
- Password field with show/hide toggle
- Confirm password field with show/hide toggle
- Terms of Service & Privacy Policy checkbox
- Newsletter subscription opt-in
- Social sign-up buttons (Google & GitHub)
- Link to sign-in page for existing users

**Design Features:**

- Glassmorphic card with soft shadows
- Gradient dream background
- Smooth animations and transitions
- Rounded pill-shaped inputs with icons
- Uppercase tracking for labels
- Brand-consistent typography (Cormorant Garamond + Inter)

### 2. Sign In (`/sign-in`)

A clean, focused login experience with:

- Email input field
- Password field with show/hide toggle
- Remember me checkbox
- Forgot password link
- Social sign-in buttons (Google & GitHub)
- Link to sign-up page for new users

**Design Features:**

- Same luxury aesthetic as sign-up
- Minimalist, distraction-free layout
- Smooth hover and focus states
- Consistent with brand guidelines

### 3. Forgot Password (`/forgot-password`)

Password recovery flow with two states:

- **Initial State:** Email input form
- **Success State:** Confirmation message with email address

**Features:**

- Back to sign-in link
- Email input field
- Success animation with mail icon
- Option to resend or try again
- Link back to sign-in after submission

## Design System Consistency

All pages follow the Becute Dreams design system:

- **Colors:** Blush pink, cream, lavender, matte ink, gold accents
- **Typography:** Cormorant Garamond (display), Inter (body)
- **Layout:** Centered, max-width 28rem (448px)
- **Effects:**
  - Glass morphism cards
  - Soft and luxe shadows
  - Gradient backgrounds
  - Smooth framer-motion animations
- **Forms:**
  - Rounded-full (pill-shaped) inputs
  - Icon-enhanced fields
  - Focus rings with brand colors
  - Smooth transitions

## Navigation Integration

The Navbar has been updated to include:

- **Desktop:** User icon button linking to `/sign-in`
- **Mobile Menu:** "Account" link in the mobile navigation drawer

## Implementation Notes

### Current State

- **Frontend Only:** These are UI/UX pages with no backend integration
- **Form Handlers:** Console.log outputs for demonstration
- **Social Auth:** Visual buttons only (no OAuth implementation)

### To Implement Later

1. Connect to authentication API/backend
2. Add form validation with react-hook-form + zod
3. Implement OAuth providers (Google, GitHub)
4. Add loading states during submission
5. Add error handling and display
6. Implement actual password reset email flow
7. Add protected route wrapper
8. Implement session management
9. Add user profile page
10. Add email verification flow

### Routes

- `/sign-in` - Sign in page
- `/sign-up` - Sign up page
- `/forgot-password` - Password reset request page

## Accessibility

All pages include:

- Proper form labels with `htmlFor` attributes
- ARIA labels for icon-only buttons
- Required field indicators
- Keyboard-accessible inputs
- Focus states for all interactive elements
- Semantic HTML structure

## Responsive Design

Pages are fully responsive:

- **Mobile:** Single column, optimized touch targets
- **Tablet:** Same layout with increased padding
- **Desktop:** Same layout, centered with max-width

## Usage

Users can access these pages by:

1. Clicking the user icon in the desktop navbar
2. Selecting "Account" in the mobile menu
3. Direct navigation to `/sign-in`, `/sign-up`, or `/forgot-password`

The pages are ready for integration with your chosen authentication provider (e.g., Supabase, Firebase, Auth0, or custom backend).
