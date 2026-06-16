# 🔐 Demo Credentials - Quick Reference

## Sign In Page

Visit: **http://localhost:5173/sign-in**

---

## 👨‍💼 Admin Account

Full access to admin dashboard, order management, and customer management.

```
Email:    admin@becutedreams.com
Password: BecuteAdmin2024!
```

**Access:**

- Admin Dashboard (`/admin`)
- Manage Orders (`/admin/orders`)
- Update Order Status
- View All Customers (`/admin/customers`)
- View Customer Details
- Dashboard Analytics

---

## 👤 Demo Customer Account

Pre-configured customer account with full shipping details. No need to register!

```
Email:    customer@example.com
Password: customer123
```

**Pre-filled Details:**

- **Name:** Demo Customer
- **Phone:** +1 (555) 123-4567
- **Address:** 123 Demo Street, Apt 4B
- **City:** New York
- **Postal Code:** 10001
- **Country:** United States

**Access:**

- Shop & Browse Products
- Add Items to Cart
- Checkout (Protected)
- Place Orders
- Track Orders (`/my-orders`)
- View Order Details
- See Status Updates from Admin

---

## 🎯 Quick Test Flow

### 1. Test as Customer

1. Sign in with: **customer@example.com** / **customer123**
2. Browse `/shop` and add items to cart
3. Go to checkout
4. Place an order
5. View order in "My Orders"

### 2. Test as Admin

1. Sign out
2. Sign in with: **admin@becutedreams.com** / **BecuteAdmin2024!**
3. Go to `/admin/orders`
4. Find the demo customer's order
5. Update status with notes
6. See timeline update

### 3. Verify Customer Sees Update

1. Sign out from admin
2. Sign in as customer again
3. Go to "My Orders"
4. See updated status!

---

## 📝 Notes

- **Both credentials are displayed on the sign-in page**
- Demo customer is automatically created on first login
- Demo customer has complete profile (no need to register)
- Perfect for testing the full order flow
- Use for demos and presentations

---

## 🆕 Still Want to Register?

You can also create a new customer account:

1. Go to `/sign-up`
2. Fill in all registration fields
3. Create your own account
4. Sign in and use it!

---

## 🔄 Reset Everything

To start fresh:

1. Open Developer Tools (F12)
2. Go to Application → Storage
3. Clear all localStorage data
4. Refresh the page
5. Sign in again!

---

## ✅ What's Stored

When you sign in with demo customer:

- User profile with shipping details
- Shopping cart (if items added)
- Orders (if placed)
- Authentication state

All stored in browser localStorage - no server needed!

---

## 🎉 Perfect for Testing!

The demo customer account makes it easy to:

- ✅ Test checkout without registration
- ✅ Demo the system to clients
- ✅ Show order management flow
- ✅ Test admin → customer sync
- ✅ Quick presentations

**No registration required - just sign in and go!** 🚀
