# Quick Reference Guide

Fast reference for the restructured codebase.

## 📁 Where to Find Things

### Adding Products?

→ `/src/features/products/products.data.ts`

### Modifying Cart Logic?

→ `/src/features/cart/cart.store.ts`

### Styling UI Components?

→ `/src/shared/components/ui/`

### Adding Homepage Sections?

→ `/src/pages/home/components/`

### Layout Changes (Navbar, Footer)?

→ `/src/shared/components/layout/`

### Route Definitions?

→ `/src/routes/`

### Global Constants?

→ `/src/core/constants/app.constants.ts`

### Utility Functions?

→ `/src/shared/utils/`

### Custom Hooks?

→ `/src/shared/hooks/`

### Assets (Images)?

→ `/src/assets/`

## 🔗 Common Import Patterns

```typescript
// Cart
import { useCart, type CartItem } from "@/features/cart";

// Products
import { products, categories, getProduct } from "@/features/products";
import type { Product, Category } from "@/features/products";

// UI Components
import { Button } from "@/shared/components/ui/button";
import { Card, CardHeader, CardContent } from "@/shared/components/ui/card";

// Layout
import { Navbar, Footer } from "@/shared/components/layout";

// Utils
import { cn } from "@/shared/utils";
import { formatCurrency, formatDate } from "@/shared/utils";
import { isValidEmail } from "@/shared/utils";

// Hooks
import { useIsMobile } from "@/shared/hooks";

// Constants
import { APP_NAME, ROUTES, CONTACT } from "@/core/constants";

// Assets
import heroImage from "@/assets/hero.jpg";
```

## 🎯 Quick Tasks

### Add a New Product

Edit: `/src/features/products/products.data.ts`

```typescript
export const products: Product[] = [
  // ... existing products
  {
    id: "p9",
    slug: "new-product-slug",
    name: "New Product Name",
    price: 25,
    category: "anime",
    image: someImage,
    description: "Product description...",
    tag: "New", // optional
  },
];
```

### Add a New Category

Edit: `/src/features/products/products.data.ts`

```typescript
export const categories: Category[] = [
  // ... existing categories
  {
    slug: "new-category",
    name: "New Category",
    tagline: "Category tagline",
    image: categoryImage,
  },
];
```

### Create a New Shared Component

1. Create file: `/src/shared/components/MyComponent.tsx`
2. Export it: Add to `/src/shared/components/index.ts` (if needed)
3. Import: `import { MyComponent } from '@/shared/components/MyComponent';`

### Add a New Route

1. Create file: `/src/routes/my-route.tsx`
2. Define route:

   ```typescript
   import { createFileRoute } from "@tanstack/react-router";

   export const Route = createFileRoute("/my-route")({
     component: MyRoute,
   });

   function MyRoute() {
     return <div>My Route Content</div>;
   }
   ```

### Add a Utility Function

Edit: `/src/shared/utils/[appropriate-file].ts`

```typescript
// For formatting
export function myFormatFunction(value: string): string {
  // implementation
}

// For validation
export function myValidation(value: string): boolean {
  // implementation
}
```

### Modify Cart Behavior

Edit: `/src/features/cart/cart.store.ts`

```typescript
export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      // Add new actions here
      myNewAction: () =>
        set((state) => ({
          // update state
        })),
    }),
    { name: "becute-cart" },
  ),
);
```

## 🏗️ Project Structure at a Glance

```
src/
├── assets/              → Images, fonts
├── core/                → App config & constants
├── features/            → Business features (cart, products)
├── pages/               → Page-specific components
├── routes/              → Route definitions
├── shared/              → Reusable code
│   ├── components/     → UI & layout components
│   ├── hooks/          → Custom hooks
│   └── utils/          → Utility functions
├── router.tsx
├── start.ts
└── styles.css
```

## 🎨 Styling Guidelines

### Use Tailwind Classes

```tsx
<div className="flex items-center gap-4 rounded-lg bg-card p-6" />
```

### Conditional Classes with cn()

```tsx
import { cn } from "@/shared/utils";

<button
  className={cn(
    "px-4 py-2 rounded-md",
    isActive && "bg-primary text-white",
    isDisabled && "opacity-50",
  )}
/>;
```

## 📦 State Management

### Local State

```tsx
const [count, setCount] = useState(0);
```

### Global State (Cart Example)

```tsx
function MyComponent() {
  const { items, add, remove } = useCart();

  return <button onClick={() => add(product)}>Add to Cart ({items.length})</button>;
}
```

## 🔍 Finding Code

### By Feature

- Cart functionality → `/src/features/cart/`
- Product data → `/src/features/products/`

### By Type

- React components → `/src/shared/components/` or `/src/pages/`
- TypeScript types → `*.types.ts` files
- State stores → `*.store.ts` files
- Static data → `*.data.ts` files

### By Usage

- Used everywhere → `/src/shared/`
- Used on one page → `/src/pages/[page-name]/`
- Business logic → `/src/features/`

## 🚀 Commands

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Format code
npm run format
```

## 📖 Full Documentation

- `PROJECT_STRUCTURE.md` - Complete structure details
- `DEVELOPER_GUIDE.md` - Development guidelines
- `README.md` - Project overview
- `RESTRUCTURE_SUMMARY.md` - Restructure details

---

**Keep this file handy for quick reference while developing!**
