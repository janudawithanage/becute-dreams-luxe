# 🚀 Quick Start Guide - Order Management System

## 1️⃣ Start Development Server

```bash
npm run dev
```

Visit: **http://localhost:5173**

---

## 2️⃣ Test Customer Flow (5 minutes)

### Step 1: Create Customer Account

- Go to `/sign-up`
- Fill in all fields:
  - Name: **Test Customer**
  - Email: **test@example.com**
  - Password: **password123**
  - Phone: **+1 555-1234**
  - Address: **123 Test St**
  - City: **Test City**
  - Postal Code: **12345**
  - Country: **Test Country**
- Click **"Create Account"**

### Step 2: Sign In

- You'll be redirected to `/sign-in`
- Sign in with: **test@example.com** / **password123**

### Step 3: Place Order

- Browse `/shop`
- Add products to cart
- Click cart icon → **"Checkout"**
- Review info, add optional notes
- Click **"Place Order"**
- Note your order number! (e.g., ORD-123456-ABC)

### Step 4: Track Order

- Click **"My Orders"** in navbar
- See your order with status **"Pending"**
- Click **"View Details"** to see full info

---

## 3️⃣ Test Admin Flow (3 minutes)

### Step 1: Sign Out

- Click **"Logout"** in navbar

### Step 2: Sign In as Admin

- Go to `/sign-in`
- Use admin credentials:
  ```
  Email: admin@becutedreams.com
  Password: BecuteAdmin2024!
  ```

### Step 3: Manage Order

- Click **"Admin"** in navbar
- Go to **"Orders"**
- Find the test customer's order
- Click to view details

### Step 4: Update Status

- Select **"Confirmed"** from dropdown
- Add note: **"Order confirmed! Processing soon."**
- Click **"Update Order Status"**
- See timeline update!

### Step 5: Continue Updates

- Update to **"Processing"** → Note: "Preparing items"
- Update to **"Shipped"** → Note: "Package on the way"
- Update to **"Delivered"** → Note: "Delivered successfully"

---

## 4️⃣ Verify Customer Sees Updates

### Step 1: Sign Out from Admin

- Click **"Logout"**

### Step 2: Sign In as Customer

- Email: **test@example.com**
- Password: **password123**

### Step 3: Check Order Status

- Click **"My Orders"**
- See updated status (should be "Delivered")
- Click **"View Details"**
- See complete timeline with all admin notes! ✨

---

## 📋 Key URLs

| Page            | URL                | Access         |
| --------------- | ------------------ | -------------- |
| Home            | `/`                | Public         |
| Shop            | `/shop`            | Public         |
| Sign Up         | `/sign-up`         | Public         |
| Sign In         | `/sign-in`         | Public         |
| Checkout        | `/checkout`        | Customers Only |
| My Orders       | `/my-orders`       | Customers Only |
| Order Detail    | `/order/:id`       | Customers Only |
| Admin Dashboard | `/admin`           | Admin Only     |
| Admin Orders    | `/admin/orders`    | Admin Only     |
| Admin Customers | `/admin/customers` | Admin Only     |

---

## 🔑 Login Credentials

### Admin

```
Email: admin@becutedreams.com
Password: BecuteAdmin2024!
```

### Demo Customer

```
Email: customer@example.com
Password: customer123
```

### Test Customer (After Registration)

```
Email: test@example.com
Password: password123
```

---

## 🎯 Order Status Flow

```
Pending → Confirmed → Processing → Shipped → Delivered
         ↘ Cancelled (can happen anytime)
```

---

## 💾 Data Storage

All data stored in browser **localStorage**:

- `auth-storage` - Users & customers
- `orders-storage` - All orders
- `cart-storage` - Shopping cart

**Clear browser data to reset everything!**

---

## 🎨 Status Colors

- 🟡 **Pending** - Yellow
- 🔵 **Confirmed** - Blue
- 🟣 **Processing** - Purple
- 🔷 **Shipped** - Indigo
- 🟢 **Delivered** - Green
- 🔴 **Cancelled** - Red

---

## 🛠️ Troubleshooting

### Can't checkout?

→ Make sure you're signed in!

### Orders not showing?

→ Check localStorage is enabled

### Status not updating?

→ Refresh the page

### Want to start fresh?

→ Clear browser data (Application → Storage → Clear)

---

## 📚 More Documentation

- **Complete Guide**: `ORDER_MANAGEMENT_SYSTEM.md`
- **System Overview**: `COMPLETE_SYSTEM_SUMMARY.md`
- **Admin Guide**: `GETTING_STARTED_ADMIN.md`
- **Auth Details**: `AUTH_IMPLEMENTATION_SUMMARY.md`

---

## ✅ Testing Checklist

- [ ] Register new customer
- [ ] Sign in as customer
- [ ] Add items to cart
- [ ] Place order
- [ ] View in "My Orders"
- [ ] Sign in as admin
- [ ] Find customer order
- [ ] Update status with note
- [ ] Sign in as customer again
- [ ] See status update!

---

## 🎉 You're All Set!

**The complete order management system is ready to use!**

Have fun testing the customer → admin → customer flow! 🚀
