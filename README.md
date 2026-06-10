# Becute Dreams Luxe - Frontend Demo

A luxury sticker boutique e-commerce frontend built with **React**, **React Router**, and **Tailwind CSS**.

## 🎨 Features

This is a **frontend-only demo** showcasing premium UI/UX design for an e-commerce website:

- ✨ Beautiful animated homepage with hero section
- 🛍️ Product catalog with categories and filtering
- 🛒 Shopping cart with localStorage persistence
- 🔐 Authentication pages (Sign In, Sign Up, Forgot Password) - UI only
- 📱 Fully responsive design
- 🎭 Smooth animations with Framer Motion
- 🎨 Custom design system with Tailwind CSS
- 📦 Product detail pages
- 🔍 Category browsing
- 📧 Contact page
- ℹ️ About/Atelier page

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── assets/           # Images and static assets
├── pages/            # Page components
│   ├── Home.tsx
│   ├── Shop.tsx
│   ├── About.tsx
│   └── ...
├── features/         # Feature modules
│   ├── cart/        # Shopping cart feature
│   └── products/    # Product catalog feature
├── shared/          # Shared code
│   ├── components/  # Reusable components
│   │   ├── layout/ # Layout components (Navbar, Footer)
│   │   └── ui/     # shadcn/ui components
│   ├── hooks/      # Custom React hooks
│   └── utils/      # Helper functions
├── App.tsx          # React Router setup
└── main.tsx         # Application entry point
```

## 🛒 Cart Functionality

The shopping cart uses **Zustand** with localStorage persistence:

- Add/remove items
- Update quantities
- Persists across page refreshes
- No backend required

## 🎯 Demo Features

### Checkout Flow

The checkout page collects order information but **does not process payments**. Order data is logged to the browser console for demo purposes.

### Product Data

All product information is hardcoded in `src/features/products/products.data.ts`. In a production app, this would come from a CMS or API.

### No Authentication

This demo includes **authentication UI pages** (sign in, sign up, forgot password) but has **no actual authentication system**. The forms are for demonstration only and don't connect to a backend.

## 🛠️ Tech Stack

- **Framework**: React 19
- **Routing**: React Router 7
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **State**: Zustand
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Build Tool**: Vite

## 📦 Key Dependencies

```json
{
  "react": "^19.2.0",
  "react-router-dom": "^7.1.3",
  "tailwindcss": "^4.2.1",
  "framer-motion": "^12.40.0",
  "zustand": "^5.0.13"
}
```

## 🎨 Design System

The project uses a custom design system with:

- **Typography**: Custom display font + system sans-serif
- **Colors**: CSS variables for theming
- **Spacing**: Consistent spacing scale
- **Animations**: Luxurious ease curves
- **Shadows**: Soft, elegant shadows

## 📝 Available Routes

- `/` - Homepage
- `/shop` - Product catalog
- `/collections` - Category browsing
- `/product/:slug` - Product detail
- `/checkout` - Checkout (demo only)
- `/about` - About page
- `/contact` - Contact page
- `/sign-in` - Sign in page (UI only)
- `/sign-up` - Sign up page (UI only)
- `/forgot-password` - Password reset page (UI only)

## 🚧 What's Missing (Intentionally Removed)

This is a **frontend-only demo**. The following features have been removed or are UI-only:

- ❌ User authentication backend (UI pages exist but don't authenticate)
- ❌ Backend API integration
- ❌ Database connectivity
- ❌ Admin panel
- ❌ Payment processing
- ❌ Order management
- ❌ Image uploads
- ❌ Real-time features

See `BACKEND_REMOVAL_SUMMARY.md` for complete details.
See `AUTH_PAGES.md` for authentication UI documentation.

## 💡 Future Enhancements

To make this production-ready, consider adding:

1. **Backend Integration**
   - REST API or GraphQL
   - Supabase, Firebase, or custom backend
2. **Authentication**
   - Firebase Auth, Auth0, or Clerk
3. **Payment Processing**
   - Stripe, PayPal integration
4. **Content Management**
   - Headless CMS (Sanity, Contentful, etc.)
5. **Image Handling**
   - CDN integration (Cloudinary, imgix)

## 📄 License

This is a demo project for portfolio/showcase purposes.

## 🤝 Contributing

This is a frontend demo. Feel free to fork and customize for your own projects!

---

Made with ❤️ using React, TanStack Start, and Tailwind CSS
