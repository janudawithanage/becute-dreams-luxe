# Admin Dashboard - Quick Start Guide

## 🎯 Access the Dashboard

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Navigate to**:
   ```
   http://localhost:5173/admin
   ```

## 📋 Dashboard Overview

### Main Sections

#### 1. Dashboard (`/admin`)

**What you'll see:**

- 4 metric cards showing Revenue, Orders, Products, and Customers
- Line chart showing revenue trends over 6 months
- Bar chart showing order volumes
- Recent orders list with status badges

**Actions available:**

- View recent orders
- Monitor key metrics at a glance
- Track business trends

---

#### 2. Products (`/admin/products`)

**What you'll see:**

- Search bar to filter products
- Table with product images, names, SKUs, categories, prices, stock, and status
- "Add Product" button in the header

**Actions available:**

- 👁️ View product details
- ✏️ Edit product (navigates to form)
- 🗑️ Delete product
- ➕ Add new product

**Try this:**

1. Click "Add Product" button
2. Fill in product details
3. Upload images (drag & drop or click)
4. Select category and status
5. Click "Save Product"

---

#### 3. Orders (`/admin/orders`)

**What you'll see:**

- Search bar to find orders by number, customer, or email
- Table showing order numbers, customers, dates, status, and totals
- "Export Orders" button

**Status colors:**

- 🟢 Green = Delivered
- 🟡 Yellow = Processing
- 🔵 Blue = Shipped
- ⚪ Gray = Pending
- 🔴 Red = Cancelled

**Actions available:**

- 👁️ View order details (click the eye icon)

**Try this:**

1. Click the eye icon on any order
2. See order timeline, items, and customer info
3. Update order status using action buttons
4. Print invoice or send email to customer

---

#### 4. Customers (`/admin/customers`)

**What you'll see:**

- 3 statistics cards (Total, Active, Revenue)
- Search bar to filter customers
- Table with customer names, contact info, join dates, order counts, and total spent

**Information displayed:**

- Name and contact details (email, phone)
- When they joined
- Number of orders placed
- Total amount spent
- Account status (Active/Inactive)

---

#### 5. Settings (`/admin/settings`)

**4 Tabs with different configurations:**

**General Tab:**

- Store Name
- Store Email
- Store Phone

**Store Tab:**

- Store Status (Enable/Disable operations)
- Maintenance Mode toggle
- Currency setting
- Timezone configuration

**Notifications Tab:**

- Toggle order notifications
- Toggle low stock alerts
- Toggle customer inquiry emails

**Shipping Tab:**

- Free shipping threshold amount
- Standard shipping rate
- Express shipping rate
- International shipping toggle

---

## 🎨 UI Features

### Navigation

- **Sidebar**: Always visible on desktop, collapsible on mobile
- **Mobile Menu**: Tap hamburger icon (☰) to open sidebar
- **Active Page**: Highlighted in purple in sidebar
- **Back Button**: Use ← on detail pages to go back

### Search

- Real-time filtering as you type
- Searches across relevant fields (names, emails, order numbers, etc.)

### Status Badges

Color-coded for quick identification:

- **Green (Success)**: Active, Delivered, Success states
- **Yellow (Warning)**: Draft, Processing, Pending states
- **Blue (Info)**: Shipped, Information states
- **Red (Destructive)**: Cancelled, Error states

### Charts

- **Interactive**: Hover over data points to see exact values
- **Responsive**: Automatically resizes on different screens
- **Real-time Ready**: Just connect to API for live data

## 📱 Responsive Design

### Desktop (> 1024px)

- Sidebar always visible (256px wide)
- Full tables with all columns
- Side-by-side layouts

### Tablet (768px - 1024px)

- Collapsible sidebar
- Responsive tables
- Stacked layouts in some sections

### Mobile (< 768px)

- Hidden sidebar (toggle with menu button)
- Mobile-optimized tables
- Full-width cards
- Touch-friendly buttons

## 🔧 Current Features

✅ **Fully Functional UI** - All pages render correctly
✅ **Mock Data** - Sample data for testing
✅ **Routing** - Navigation between all pages
✅ **Search** - Filter functionality on listings
✅ **Forms** - Complete forms for products and settings
✅ **Charts** - Visual analytics with Recharts
✅ **Responsive** - Mobile, tablet, and desktop layouts

## 🚧 Ready for Integration

The UI is complete and ready for:

- Backend API connection
- Real database data
- Authentication system
- File upload service
- State management (Zustand already installed)
- Form validation (React Hook Form + Zod already installed)

## 💡 Tips

1. **Mock Data Location**:
   - `src/features/admin/admin.data.ts`
   - Modify this file to test with different data

2. **Add More Products**:
   - Edit `mockAdminProducts` array
   - Add more objects with the same structure

3. **Change Colors**:
   - Badge variants in component files
   - Tailwind classes for quick color changes

4. **Customize Layout**:
   - Sidebar width: Change `w-64` class in `AdminLayout.tsx`
   - Card padding: Modify `p-6` classes in Card components

## 🎯 Testing Checklist

- [ ] Access dashboard at `/admin`
- [ ] View all statistics cards
- [ ] Check charts render correctly
- [ ] Navigate to Products page
- [ ] Click "Add Product" and view form
- [ ] Navigate to Orders page
- [ ] Click eye icon to view order details
- [ ] Navigate to Customers page
- [ ] Navigate to Settings page
- [ ] Try all 4 settings tabs
- [ ] Test mobile responsive (resize browser)
- [ ] Test sidebar collapse on mobile
- [ ] Try search on Products page
- [ ] Try search on Orders page
- [ ] Try search on Customers page

## 📞 Quick Reference

### URLs

```
Dashboard:         /admin
Products:          /admin/products
Add Product:       /admin/products/new
Edit Product:      /admin/products/:id/edit
Orders:            /admin/orders
Order Detail:      /admin/orders/:id
Customers:         /admin/customers
Settings:          /admin/settings
```

### File Locations

```
Pages:             src/pages/admin/
Types:             src/features/admin/admin.types.ts
Mock Data:         src/features/admin/admin.data.ts
UI Components:     src/shared/components/ui/
```

## 🎉 You're All Set!

The admin dashboard is fully implemented and ready to use. Start the dev server and navigate to `/admin` to explore all features!

For backend integration, see `ADMIN_DASHBOARD.md` for API endpoint specifications.
