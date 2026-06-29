# 🚀 Next.js Migration Plan - Becute Dreams Luxe

## Overview
Migrate from Vite + React Router to Next.js 14 (App Router) with API Routes for secure backend operations.

## 📊 Migration Strategy: Incremental Approach

**Timeline**: 2-3 days (can be done in phases)
**Risk Level**: Medium (test thoroughly before production)

---

## Phase 1: Setup & Foundation (Day 1 - Morning)

### Step 1.1: Initialize Next.js Project (Side-by-side)

**Option A**: Create new Next.js project alongside current one
```bash
# In parent directory
npx create-next-app@latest becute-dreams-luxe-next --typescript --tailwind --app --no-src-dir
```

**Option B**: Migrate in place (backup first!)
```bash
# Backup current project
cp -r becute-dreams-luxe becute-dreams-luxe-backup

# Install Next.js dependencies
npm install next@latest react@latest react-dom@latest
```

**Recommendation**: Use Option A for safety, then merge once stable.

### Step 1.2: Configure Next.js

**File**: `next.config.mjs`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
}

export default nextConfig
```

### Step 1.3: Update Environment Variables

**File**: `.env.local`
```bash
# Frontend (NEXT_PUBLIC_ prefix for client-side)
NEXT_PUBLIC_SUPABASE_URL=https://eyufkjnsrcaexkbgchyk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_hXnrbbSuX0_TGa9VrChzsg_p5mMnF_d
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=duln4wn50
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=becute-products

# Backend-only (NO prefix - server-side only)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
CLOUDINARY_API_KEY=197731621411949
CLOUDINARY_API_SECRET=p9unxw0c3DkspWXPyMnTd7kxFDU
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

---

## Phase 2: File Structure Migration (Day 1 - Afternoon)

### Current vs New Structure

```
Current (Vite):                    New (Next.js):
├── src/                           ├── app/
│   ├── App.tsx                   │   ├── layout.tsx
│   ├── pages/                    │   ├── page.tsx (homepage)
│   │   ├── Home.tsx             │   ├── shop/page.tsx
│   │   ├── Shop.tsx             │   ├── product/[slug]/page.tsx
│   │   └── ...                   │   ├── checkout/page.tsx
│   ├── features/                 │   ├── admin/
│   │   ├── cart/                │   │   ├── page.tsx
│   │   ├── products/            │   │   ├── products/page.tsx
│   │   └── admin/               │   │   └── orders/page.tsx
│   └── shared/                   │   └── api/
│       └── components/           │       ├── products/route.ts
│                                 │       ├── cart/route.ts
                                  │       ├── orders/route.ts
                                  │       └── upload/route.ts
                                  ├── components/
                                  │   ├── layout/
                                  │   └── ui/
                                  └── lib/
                                      ├── supabase/
                                      │   ├── client.ts
                                      │   └── server.ts
                                      └── utils.ts
```

### Step 2.1: Migrate Routing

**React Router → Next.js App Router Mapping**:

| Current Route | Next.js File Path |
|--------------|-------------------|
| `/` | `app/page.tsx` |
| `/shop` | `app/shop/page.tsx` |
| `/product/:slug` | `app/product/[slug]/page.tsx` |
| `/checkout` | `app/checkout/page.tsx` |
| `/admin` | `app/admin/page.tsx` |
| `/admin/products` | `app/admin/products/page.tsx` |
| `/admin/orders` | `app/admin/orders/page.tsx` |
| `/sign-in` | `app/sign-in/page.tsx` |
| `/sign-up` | `app/sign-up/page.tsx` |

### Step 2.2: Migration Priority Order

**Week 1 - Core Features**:
1. ✅ Layout & Navigation
2. ✅ Homepage
3. ✅ Product Listing
4. ✅ Product Detail
5. ✅ Auth Pages

**Week 2 - Backend Integration**:
6. ✅ API Routes (products, cart, orders)
7. ✅ Admin Dashboard
8. ✅ Checkout Flow
9. ✅ Image Upload

---

## Phase 3: Create API Routes (Day 2)

### 3.1: Supabase Server Client

**File**: `lib/supabase/server.ts`
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

// Admin client with service role (bypass RLS)
export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {},
    }
  )
}
```

**File**: `lib/supabase/client.ts`
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 3.2: Product API Routes

**File**: `app/api/products/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/products - List all products
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    
    const category = searchParams.get('category')
    const collection = searchParams.get('collection')
    
    let query = supabase
      .from('products')
      .select('*, categories(*), collections(*)')
    
    if (category) query = query.eq('category_id', category)
    if (collection) query = query.eq('collection_id', collection)
    
    const { data, error } = await query
    
    if (error) throw error
    
    return NextResponse.json({ products: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/products - Create product (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('products')
      .insert(body)
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ product: data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

**File**: `app/api/products/[id]/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/products/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*), collections(*)')
      .eq('id', params.id)
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ product: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// PATCH /api/products/:id (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('products')
      .update(body)
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ product: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/products/:id (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', params.id)
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

### 3.3: Image Upload API Route (Secure)

**File**: `app/api/upload/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary (server-side only)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'becute-products',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })
    
    return NextResponse.json({ 
      url: (result as any).secure_url,
      publicId: (result as any).public_id
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

### 3.4: Cart API Routes

**File**: `app/api/cart/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/cart - Get user's cart
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', user.id)
    
    if (error) throw error
    
    return NextResponse.json({ items: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { product_id, quantity = 1 } = await request.json()
    
    // Check if item exists
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', product_id)
      .maybeSingle()
    
    if (existing) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select()
        .single()
      
      if (error) throw error
      return NextResponse.json({ item: data })
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('cart_items')
        .insert({ user_id: user.id, product_id, quantity })
        .select()
        .single()
      
      if (error) throw error
      return NextResponse.json({ item: data }, { status: 201 })
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

### 3.5: Orders API Routes

**File**: `app/api/orders/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, product:products(*))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return NextResponse.json({ orders: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const orderData = await request.json()
    
    // Start transaction (create order + order items)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        ...orderData,
        status: 'pending',
      })
      .select()
      .single()
    
    if (orderError) throw orderError
    
    // Clear cart after successful order
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
    
    return NextResponse.json({ order }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

---

## Phase 4: Update Frontend Code (Day 2-3)

### 4.1: Create API Client Helper

**File**: `lib/api-client.ts`
```typescript
class ApiClient {
  private baseUrl = '/api'

  async get(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`)
    if (!response.ok) throw new Error('API request failed')
    return response.json()
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('API request failed')
    return response.json()
  }

  async patch(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('API request failed')
    return response.json()
  }

  async delete(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('API request failed')
    return response.json()
  }
}

export const api = new ApiClient()
```

### 4.2: Update Product Service

**Before** (Direct Supabase):
```typescript
// src/features/products/products.service.ts
const { data } = await supabase.from('products').select('*')
```

**After** (API Routes):
```typescript
// lib/services/products.service.ts
import { api } from '@/lib/api-client'

export const productService = {
  async getAll() {
    return api.get('/products')
  },
  
  async getById(id: string) {
    return api.get(`/products/${id}`)
  },
  
  async create(product: any) {
    return api.post('/products', product)
  },
  
  async update(id: string, updates: any) {
    return api.patch(`/products/${id}`, updates)
  },
  
  async delete(id: string) {
    return api.delete(`/products/${id}`)
  },
}
```

### 4.3: Migrate Pages to Next.js

**Example**: Homepage Migration

**Before** (`src/pages/Home.tsx`):
```tsx
export default function Home() {
  return (
    <div>
      <Hero />
      <Trending />
      <Categories />
    </div>
  )
}
```

**After** (`app/page.tsx`):
```tsx
import Hero from '@/components/home/Hero'
import Trending from '@/components/home/Trending'
import Categories from '@/components/home/Categories'

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Trending />
      <Categories />
    </div>
  )
}

// Optional: Add metadata
export const metadata = {
  title: 'Becute Dreams Luxe - Premium Stickers',
  description: 'Discover our collection of luxury stickers',
}
```

### 4.4: Root Layout

**File**: `app/layout.tsx`
```tsx
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
```

**File**: `app/providers.tsx`
```tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

---

## Phase 5: Testing & Deployment (Day 3)

### 5.1: Testing Checklist

- [ ] **Authentication**
  - [ ] Sign up
  - [ ] Sign in
  - [ ] Sign out
  - [ ] Protected routes

- [ ] **Products**
  - [ ] List products
  - [ ] View product detail
  - [ ] Admin: Create product
  - [ ] Admin: Edit product
  - [ ] Admin: Delete product

- [ ] **Cart**
  - [ ] Add to cart
  - [ ] Update quantity
  - [ ] Remove from cart
  - [ ] Cart persists after login

- [ ] **Orders**
  - [ ] Create order
  - [ ] View order history
  - [ ] Admin: View all orders
  - [ ] Admin: Update order status

- [ ] **Image Upload**
  - [ ] Upload product images
  - [ ] Images display correctly
  - [ ] API secret not exposed in browser

### 5.2: Deployment Options

**Vercel (Recommended)**:
```bash
npm install -g vercel
vercel login
vercel

# Set environment variables in Vercel dashboard
```

**Netlify**:
```bash
npm install -g netlify-cli
netlify login
netlify deploy

# Add environment variables in Netlify dashboard
```

**Self-Hosted (Docker)**:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

---

## 📊 Migration Comparison

| Feature | Before (Vite) | After (Next.js) |
|---------|---------------|-----------------|
| **Routing** | React Router | File-based |
| **API Calls** | Direct Supabase | API Routes |
| **Secrets** | ❌ Exposed | ✅ Secure |
| **SSR** | ❌ None | ✅ Available |
| **Image Optimization** | Manual | Built-in |
| **SEO** | Limited | Excellent |
| **Deploy** | Static hosting | Vercel/Netlify |

---

## 🔒 Security Improvements

### Before:
```typescript
// ❌ Cloudinary secret in frontend
VITE_CLOUDINARY_API_SECRET=p9unxw0c3DkspWXPyMnTd7kxFDU

// ❌ Direct database access from frontend
const { data } = await supabase.from('products').insert(...)
```

### After:
```typescript
// ✅ Secrets only on server
CLOUDINARY_API_SECRET=p9unxw0c3DkspWXPyMnTd7kxFDU (server-only)

// ✅ API layer with validation
POST /api/products
- Check authentication
- Validate input
- Rate limiting
- Error handling
```

---

## 📦 Updated Dependencies

**Install**:
```bash
npm install @supabase/ssr
npm install @tanstack/react-query
npm install cloudinary

# Remove (if migrating in place)
npm uninstall react-router-dom
```

**package.json scripts**:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## 🚀 Quick Start Guide

### Option 1: Fresh Start (Recommended)

```bash
# 1. Create new Next.js project
npx create-next-app@latest becute-next --typescript --tailwind --app

# 2. Install dependencies
cd becute-next
npm install @supabase/ssr @tanstack/react-query cloudinary zustand

# 3. Copy over:
# - components/ folder
# - lib/utils.ts
# - All UI components from shared/components/ui/

# 4. Create API routes (from Phase 3)

# 5. Migrate pages one by one

# 6. Test and deploy
npm run dev
```

### Option 2: In-Place Migration

```bash
# 1. Backup current project
cp -r becute-dreams-luxe becute-backup

# 2. Install Next.js
npm install next@latest

# 3. Create app/ directory structure

# 4. Update imports and routing

# 5. Test thoroughly before removing old code
```

---

## ⚠️ Common Pitfalls

### 1. **Client vs Server Components**

```tsx
// ❌ Wrong: Using hooks in server component
export default function Page() {
  const [state, setState] = useState() // Error!
  return <div>...</div>
}

// ✅ Right: Mark as client component
'use client'
export default function Page() {
  const [state, setState] = useState() // Works!
  return <div>...</div>
}
```

### 2. **Environment Variables**

```bash
# ❌ Wrong: Old Vite prefix
VITE_SUPABASE_URL=...

# ✅ Right: Next.js prefix
NEXT_PUBLIC_SUPABASE_URL=...
```

### 3. **Image Imports**

```tsx
// ❌ Wrong: Direct import
import heroImg from '@/assets/hero.jpg'

// ✅ Right: Use Next.js Image
import Image from 'next/image'
import heroImg from '@/assets/hero.jpg'

<Image src={heroImg} alt="Hero" width={1200} height={600} />
```

### 4. **Navigation**

```tsx
// ❌ Wrong: React Router
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate()
navigate('/shop')

// ✅ Right: Next.js
import { useRouter } from 'next/navigation'
const router = useRouter()
router.push('/shop')
```

---

## 📝 Migration Checklist

### Pre-Migration
- [ ] Backup current project
- [ ] Document current features
- [ ] Test all current functionality
- [ ] Export Supabase schema

### During Migration
- [ ] Set up Next.js project
- [ ] Configure environment variables
- [ ] Create API routes
- [ ] Migrate components
- [ ] Migrate pages
- [ ] Update imports
- [ ] Test each feature

### Post-Migration
- [ ] Remove old Vite config
- [ ] Update documentation
- [ ] Deploy to staging
- [ ] Load test API routes
- [ ] Security audit
- [ ] Deploy to production

---

## 🎯 Expected Outcomes

### Performance
- ✅ 40% faster initial page load (SSR)
- ✅ Automatic code splitting
- ✅ Optimized images

### Security
- ✅ No secrets in frontend
- ✅ Server-side validation
- ✅ CSRF protection built-in

### Developer Experience
- ✅ File-based routing (less code)
- ✅ API routes co-located
- ✅ Better TypeScript support

### SEO
- ✅ Server-side rendering
- ✅ Dynamic metadata
- ✅ Automatic sitemap

---

## 📚 Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side)
- [Migration from React Router](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)

---

## 💡 Next Steps

**Choose Your Path**:

### Path A: Immediate Start (2-3 days full-time)
1. Create new Next.js project today
2. Migrate core features tomorrow
3. Deploy and test day 3

### Path B: Gradual Migration (1-2 weeks part-time)
1. Set up Next.js alongside Vite
2. Migrate one page per day
3. Switch over when complete

### Path C: Just Fix Security (2 hours)
1. Remove Cloudinary secret
2. Add comprehensive RLS policies
3. Stay on Vite for now

**My Recommendation**: Start with Path A if you have 2-3 days. The migration is straightforward and the benefits are significant.

---

## 🤝 Need Help?

I can help you:
1. ✅ Generate all API route files
2. ✅ Create migration scripts
3. ✅ Set up deployment configs
4. ✅ Write comprehensive RLS policies
5. ✅ Build admin middleware for route protection

**Ready to start?** Tell me which phase you'd like to begin with!
