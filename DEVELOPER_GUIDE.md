# Developer Guide

Complete guide for developers working on the Becute Dreams Luxe project.

## 📚 Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Code Organization](#code-organization)
4. [Import Guidelines](#import-guidelines)
5. [Naming Conventions](#naming-conventions)
6. [Component Guidelines](#component-guidelines)
7. [State Management](#state-management)
8. [Styling Guidelines](#styling-guidelines)
9. [Adding New Features](#adding-new-features)
10. [Common Patterns](#common-patterns)

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- VS Code (recommended)

### Setup

```bash
# Clone and install
git clone <repository>
cd becute-dreams-luxe
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── assets/           # Static assets
├── core/             # Core app configuration
│   ├── config/      # App-wide config
│   └── constants/   # Global constants
├── features/         # Feature modules
│   ├── cart/        # Shopping cart
│   └── products/    # Product catalog
├── pages/           # Page components
│   ├── Home.tsx
│   ├── Shop.tsx
│   ├── About.tsx
│   └── ...
├── shared/          # Shared code
│   ├── components/  # Reusable components
│   ├── hooks/       # Custom hooks
│   └── utils/       # Utilities
├── App.tsx          # React Router setup
├── main.tsx         # Entry point
└── styles.css       # Global styles
```

## 🏗️ Code Organization

### When to Create a Feature

Create a new feature module when:

- ✅ It represents a distinct business domain
- ✅ It will be reused across multiple pages
- ✅ It has its own state management
- ✅ It contains 3+ related components

### Feature Structure

```
features/my-feature/
├── components/           # Feature-specific components
│   ├── MyComponent.tsx
│   └── index.ts
├── hooks/               # Feature-specific hooks (optional)
├── my-feature.store.ts  # State management
├── my-feature.types.ts  # TypeScript types
├── my-feature.data.ts   # Static data/utilities
├── index.ts            # Public API
└── README.md           # Feature documentation
```

## 📦 Import Guidelines

### Path Aliases

```typescript
// ✅ Use aliases for cleaner imports
import { Button } from "@/shared/components/ui/button";
import { useCart } from "@/features/cart";
import { products } from "@/features/products";
import { cn } from "@/shared/utils";
import heroImage from "@/assets/hero.jpg";

// ❌ Avoid relative paths
import { Button } from "../../../shared/components/ui/button";
```

### Import Order

```typescript
// 1. External libraries
import { useState } from "react";
import { motion } from "framer-motion";

// 2. Internal aliases (by category)
import { Button } from "@/shared/components/ui/button";
import { useCart } from "@/features/cart";
import { APP_NAME } from "@/core/constants";

// 3. Relative imports (if unavoidable)
import { LocalComponent } from "./LocalComponent";

// 4. Types
import type { Product } from "@/features/products";

// 5. Styles/assets
import "./styles.css";
```

### Barrel Exports

Each feature/module should export through `index.ts`:

```typescript
// features/cart/index.ts
export * from "./cart.types";
export * from "./cart.store";
export * from "./components/CartDrawer";

// Usage
import { useCart, CartDrawer, type CartItem } from "@/features/cart";
```

## 📝 Naming Conventions

### Files

- **Components**: `PascalCase.tsx` → `Navbar.tsx`, `ProductCard.tsx`
- **Hooks**: `kebab-case.tsx` → `use-mobile.tsx`, `use-debounce.tsx`
- **Utils**: `kebab-case.ts` → `format.ts`, `validation.ts`
- **Types**: `kebab-case.types.ts` → `cart.types.ts`
- **Stores**: `kebab-case.store.ts` → `cart.store.ts`
- **Data**: `kebab-case.data.ts` → `products.data.ts`

### Variables & Functions

```typescript
// ✅ Descriptive names
const cartItems = useCart((state) => state.items);
const handleAddToCart = () => { ... };
const isProductAvailable = checkAvailability(product);

// ❌ Unclear names
const items = useCart((state) => state.items);
const handle = () => { ... };
const check = checkAvailability(product);
```

### Components

```typescript
// ✅ PascalCase, descriptive
function ProductCard({ product }: ProductCardProps) { ... }
function CartDrawer() { ... }
function UserProfileAvatar() { ... }

// ❌ Vague or inconsistent
function Card() { ... }
function drawer() { ... }
function UserProfAvatar() { ... }
```

## 🧩 Component Guidelines

### Component Structure

```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import type { Product } from '@/features/products';

// 2. Types/Interfaces
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

// 3. Component
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // 3a. Hooks
  const [quantity, setQuantity] = useState(1);

  // 3b. Handlers
  const handleAdd = () => {
    onAddToCart?.(product);
  };

  // 3c. Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}

// 4. Sub-components (if needed)
function ProductBadge({ tag }: { tag: string }) {
  return <span>{tag}</span>;
}
```

### Props Best Practices

```typescript
// ✅ Explicit prop types
interface Props {
  title: string;
  description?: string;
  onClose: () => void;
  items: Product[];
}

// ✅ Destructure in function signature
function MyComponent({ title, description, onClose }: Props) { ... }

// ✅ Optional callbacks with ?. operator
onClick?.(event);

// ❌ Accessing props object directly
function MyComponent(props: Props) {
  return <div>{props.title}</div>; // Avoid this
}
```

## 🔄 State Management

### Local State

Use `useState` for component-only state:

```typescript
function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### Global State (Zustand)

For app-wide state, use Zustand:

```typescript
// cart.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product) =>
        set((state) => ({
          items: [...state.items, { product, qty: 1 }],
        })),
      // ...
    }),
    { name: "cart-storage" },
  ),
);

// Usage in component
function MyComponent() {
  const { items, add } = useCart();
  // ...
}
```

## 🎨 Styling Guidelines

### Tailwind Classes

```typescript
// ✅ Use utility classes
<div className="flex items-center gap-4 rounded-lg bg-card p-4 shadow-sm">

// ✅ Use cn() for conditional classes
import { cn } from '@/shared/utils';

<button
  className={cn(
    "px-4 py-2 rounded-md",
    isActive && "bg-primary text-white",
    isDisabled && "opacity-50 cursor-not-allowed"
  )}
>

// ✅ Extract to constants for reused patterns
const cardStyles = "rounded-lg bg-card p-6 shadow-sm";
<div className={cardStyles}>
```

### Component Variants

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva("rounded-md font-medium transition-colors", {
  variants: {
    variant: {
      default: "bg-primary text-white hover:bg-primary/90",
      outline: "border border-input hover:bg-accent",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 text-sm",
      lg: "h-12 px-8",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});
```

## ➕ Adding New Features

### Step-by-Step

1. **Create feature directory**

   ```bash
   mkdir -p src/features/my-feature/components
   ```

2. **Define types**

   ```typescript
   // my-feature.types.ts
   export interface MyFeatureItem {
     id: string;
     name: string;
   }
   ```

3. **Create store (if needed)**

   ```typescript
   // my-feature.store.ts
   import { create } from "zustand";

   export const useMyFeature = create<MyFeatureState>()((set) => ({
     // state and actions
   }));
   ```

4. **Create components**

   ```typescript
   // components/MyFeatureCard.tsx
   export function MyFeatureCard() { ... }
   ```

5. **Create barrel export**

   ```typescript
   // index.ts
   export * from "./my-feature.types";
   export * from "./my-feature.store";
   export * from "./components/MyFeatureCard";
   ```

6. **Add documentation**

   ```markdown
   // README.md

   # My Feature

   Description and usage...
   ```

## 🔨 Common Patterns

### Loading States

```typescript
function ProductList() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  if (isLoading) return <LoadingSpinner />;
  if (products.length === 0) return <EmptyState />;

  return <ProductGrid products={products} />;
}
```

### Error Handling

```typescript
function MyComponent() {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => setError(null)} />;
  }

  // Normal render
}
```

### Async Operations

```typescript
async function handleSubmit() {
  try {
    setIsLoading(true);
    await someAsyncOperation();
    toast.success("Operation successful!");
  } catch (error) {
    toast.error("Something went wrong");
    console.error(error);
  } finally {
    setIsLoading(false);
  }
}
```

### Form Handling

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log(data);
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
}
```

## 🧪 Testing (Future)

When adding tests:

```typescript
// MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## 📚 Additional Resources

- [TanStack Router Docs](https://tanstack.com/router/latest)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [shadcn/ui Components](https://ui.shadcn.com)

---

**Questions?** Check the feature README files or create an issue in the repository.
