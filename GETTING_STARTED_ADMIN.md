# 🚀 Getting Started with Admin Dashboard

## Quick Start (5 Minutes)

### Step 1: Start the Development Server
```bash
npm run dev
```

### Step 2: Open Your Browser
Navigate to: **http://localhost:5173**

### Step 3: Sign In as Admin
1. Click **"Sign In"** in the top navigation
2. You'll see a blue box with admin credentials on the sign-in page:
   ```
   Email:    admin@becutedreams.com
   Password: BecuteAdmin2024!
   ```
3. Enter these credentials and click **"Sign In"**
4. You'll be automatically redirected to the admin dashboard! 🎉

### Step 4: Explore the Admin Panel
You now have access to:
- **Dashboard** - Analytics, charts, and recent orders
- **Products** - Product catalog management
- **Orders** - Order tracking and management
- **Customers** - Customer information
- **Settings** - Application configuration

## 📱 Accessing Admin Panel

### From Main Website:
- **Desktop**: Look for the **"Admin"** button (with shield icon 🛡️) in the top navigation
- **Mobile**: Open the menu and tap **"Admin Dashboard"**

### Direct Access:
- Navigate directly to: **http://localhost:5173/admin**
- (You'll be redirected to sign-in if not logged in)

## 🔄 Switching Between Views

### Admin → Website:
- Click the **"Becute Dreams"** logo in the admin sidebar
- Opens the main e-commerce site in a new context

### Website → Admin:
- Click **"Admin"** button in the navigation (only visible when logged in as admin)

## 🚪 Logging Out

### Option 1 - From Admin Panel:
- Click **"Logout"** at the bottom of the admin sidebar

### Option 2 - From Main Website:
- Click **"Logout"** in the top navigation

### After Logout:
- You'll be redirected to the sign-in page
- Auth state is cleared
- Need to sign in again to access admin

## 🔐 Security Features

### Protected Routes:
- All `/admin/*` routes require authentication
- Non-admin users are redirected to home page
- Unauthenticated users are redirected to sign-in

### Persistent Sessions:
- Your login persists across page refreshes
- Stored securely in browser localStorage
- Automatically logged out if you clear browser data

### Role-Based Access:
- **Admin**: Full access to dashboard and management features
- **Customer**: Can sign in but cannot access admin panel

## 🎨 Admin Dashboard Features

### 📊 Dashboard Page (`/admin`)
- Revenue overview with line chart
- Order statistics with bar chart
- Key metrics cards (revenue, orders, products, customers)
- Recent orders list with status badges
- Trend indicators (up/down percentages)

### 📦 Products Page (`/admin/products`)
- View all products in a table
- Add new products
- Edit existing products
- Search and filter
- Product status management

### 🛒 Orders Page (`/admin/orders`)
- Order list with customer details
- Order status tracking
- Order details view
- Search and filter orders

### 👥 Customers Page (`/admin/customers`)
- Customer list
- Customer details
- Order history per customer

### ⚙️ Settings Page (`/admin/settings`)
- Application configuration
- User preferences
- Theme settings

## 🛠️ Troubleshooting

### Can't Sign In?
**Issue**: "Invalid email or password" error

**Solutions**:
1. ✅ Check email is exactly: `admin@becutedreams.com` (case-sensitive)
2. ✅ Check password is exactly: `BecuteAdmin2024!` (case-sensitive)
3. ✅ Make sure `.env.local` file exists in project root
4. ✅ Restart dev server after changing `.env.local`

### Admin Button Not Showing?
**Issue**: Can't see "Admin" button in navigation

**Solutions**:
1. ✅ Make sure you're logged in with admin credentials
2. ✅ Check that you see "Admin" text next to "Logout" in navbar
3. ✅ Try logging out and logging in again
4. ✅ Clear browser localStorage and sign in again

### Redirected to Home from Admin?
**Issue**: Automatically redirected to home when accessing `/admin`

**Solutions**:
1. ✅ You're logged in as a customer, not admin
2. ✅ Log out and sign in with admin credentials
3. ✅ Check that `.env.local` has correct admin email

### Page Refresh Logs Me Out?
**Issue**: Need to sign in again after refreshing

**Solutions**:
1. ✅ Check browser console for errors
2. ✅ Verify localStorage is enabled in browser
3. ✅ Try in incognito/private window
4. ✅ Clear all browser data and try again

## 📂 File Locations

### Environment Variables:
```
.env.local
```

### Auth System:
```
src/features/auth/
├── auth.store.ts      # Authentication logic
├── index.ts           # Exports
└── README.md          # Documentation
```

### Protected Routes:
```
src/shared/components/auth/
└── ProtectedRoute.tsx
```

### Admin Pages:
```
src/pages/admin/
├── AdminLayout.tsx    # Admin shell with sidebar
├── Dashboard.tsx      # Main dashboard
├── Products.tsx       # Product management
├── Orders.tsx         # Order management
├── Customers.tsx      # Customer management
└── Settings.tsx       # Settings page
```

### Sign In Page:
```
src/pages/
└── SignIn.tsx
```

## 🎯 Common Tasks

### Change Admin Password:
1. Open `.env.local`
2. Change `VITE_ADMIN_PASSWORD` value
3. Restart dev server
4. Use new password to sign in

### Change Admin Email:
1. Open `.env.local`
2. Change `VITE_ADMIN_EMAIL` value
3. Restart dev server
4. Use new email to sign in

### Add New Admin Route:
1. Create page component in `src/pages/admin/`
2. Add to `navigation` array in `AdminLayout.tsx`
3. Add route in `App.tsx` under admin routes
4. Protected automatically!

### Customize Admin Theme:
1. Open `src/pages/admin/AdminLayout.tsx`
2. Modify Tailwind classes
3. Update gradient colors
4. Change sidebar layout

## 📚 Additional Resources

- **Auth System Documentation**: `src/features/auth/README.md`
- **Quick Reference**: `ADMIN_ACCESS.md`
- **Implementation Details**: `AUTH_IMPLEMENTATION_SUMMARY.md`
- **Admin Features Overview**: `ADMIN_DASHBOARD.md`

## 🎉 You're All Set!

You now have a fully functional admin authentication system with:
- ✅ Secure admin login
- ✅ Protected admin routes
- ✅ Beautiful admin dashboard
- ✅ Role-based access control
- ✅ Persistent sessions
- ✅ Easy logout

**Happy managing your boutique! 🛍️✨**
