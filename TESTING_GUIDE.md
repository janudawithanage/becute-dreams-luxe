# Testing Guide - Becute Dreams Luxe
**Ready to Test!** 🚀

---

## 🚀 Quick Start

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Start the development server
npm run dev

# 3. Open in browser
# The app will be running at: http://localhost:5173
```

---

## 👤 Demo Credentials

### Admin Account
- **Email:** `admin@becutedreams.com`
- **Password:** `BecuteAdmin2024!`
- **Access:** Full admin dashboard, product management, order management, customer list

### Demo Customer Account
- **Email:** `customer@example.com`
- **Password:** `customer123`
- **Access:** Shopping, cart, checkout, order history

### Or Create New Account
- Sign up at `/sign-up`
- You'll be automatically logged in after registration
- All required fields must be filled

---

## 🧪 Test Scenarios

### 1. Customer Shopping Flow ✅

#### Browse Products
1. Go to homepage (`/`)
2. Click "Shop" in navigation or "Discover stickers" button
3. **Verify:** Product grid displays with images, names, prices

#### Filter & Search
1. On Shop page, click category filters (Anime, Cute, Laptop, etc.)
2. **Verify:** Products filter correctly
3. Use search box to search for a product (e.g., "sakura")
4. **Verify:** Search results update in real-time

#### View Product Details
1. Click any product card
2. **Verify:** 
   - Product details page loads
   - Image, name, price, description display
   - Quantity selector works
   - "Add to basket" button present

#### Add to Cart
1. Click "Add to basket" on product detail page
2. **Verify:** 
   - Toast notification appears (top right)
   - Cart badge updates in navbar
   - Cart drawer opens automatically

#### Cart Management
1. Click cart icon in navbar
2. **Verify:** Cart drawer opens with items
3. Adjust quantities using +/- buttons
4. **Verify:** Totals update correctly
5. Click trash icon to remove item
6. **Verify:** Item removed, toast notification appears

#### Checkout (Signed Out)
1. With items in cart, click "Checkout"
2. **Verify:** Redirected to sign-in page with message
3. Sign in or create account

#### Checkout (Signed In)
1. With items in cart, click "Checkout"
2. **Verify:** 
   - Checkout page loads
   - Shipping info pre-filled from profile
   - Order summary shows correct items and prices
3. Add optional order notes
4. Click "Place order"
5. **Verify:**
   - Toast notification: "Order placed successfully!"
   - Success page displays with order number
   - Email confirmation note shown

#### View Orders
1. After placing order, click "View My Orders"
2. **Verify:** 
   - Orders list displays
   - Most recent order appears at top
   - Order shows status (Pending)
3. Click "View Details" on an order
4. **Verify:**
   - Order detail page shows all information
   - Status history visible
   - Items list correct

---

### 2. Admin Product Management ✅

#### Access Admin Dashboard
1. Sign in with admin credentials
2. **Verify:** "Admin" link appears in navbar
3. Click "Admin" link
4. **Verify:** Dashboard loads with stats

#### View Products
1. In admin sidebar, click "Products"
2. **Verify:** 
   - Products table displays
   - All products shown with images
   - Search box present

#### Search Products
1. Type product name in search box
2. **Verify:** Table filters in real-time

#### Create New Product
1. Click "Add Product" button (top right)
2. Fill in form:
   - **Name:** Test Sticker Pack
   - **Description:** Beautiful test stickers for testing
   - **Price:** 15.99
   - **Category:** Select "Cute Stickers"
   - **Tag:** Select "New" (optional)
3. Upload an image (any image file)
4. **Verify:** Image preview appears
5. Click "Save Product"
6. **Verify:**
   - Toast notification: "Product created successfully!"
   - Redirected to products list
   - New product appears in table

#### Edit Product
1. Click edit icon (pencil) on any product
2. **Verify:** Form loads with existing data
3. Change price or description
4. Click "Update Product"
5. **Verify:**
   - Toast notification: "Product updated successfully!"
   - Changes reflected in products list

#### Delete Product
1. Click delete icon (trash) on any product
2. **Verify:** Confirmation dialog appears
3. Click "Cancel"
4. **Verify:** Product not deleted
5. Click delete again, then "Delete"
6. **Verify:**
   - Toast notification: "Product deleted successfully!"
   - Product removed from list

#### View Product on Site
1. Click eye icon on any product
2. **Verify:** Opens product detail page (customer view)

---

### 3. Admin Order Management ✅

#### View Orders
1. In admin sidebar, click "Orders"
2. **Verify:** 
   - Orders table displays
   - All customer orders shown
   - Status badges visible

#### Update Order Status
1. Click on any order to view details
2. Use status dropdown to change status:
   - Pending → Confirmed
   - Confirmed → Processing
   - Processing → Shipped
   - Shipped → Delivered
3. Add optional note
4. Click "Update Status"
5. **Verify:**
   - Status updates
   - Status history shows new entry
   - Timeline displays correctly

#### Filter/Search Orders
1. Use search to find orders by customer name or order number
2. **Verify:** Results filter correctly

---

### 4. Admin Customer Management ✅

#### View Customers
1. In admin sidebar, click "Customers"
2. **Verify:** 
   - Customer list displays
   - Shows all registered customers
   - Customer info visible (name, email, join date)

#### Search Customers
1. Use search to find customers by name or email
2. **Verify:** Results filter correctly

---

### 5. Authentication Flow ✅

#### Sign Up
1. Click "Sign In" → "Sign up"
2. Fill in all required fields:
   - Name, email, password, confirm password
   - Phone, address, city, postal code, country
3. Accept terms
4. Click "Create Account"
5. **Verify:**
   - Account created
   - **Automatically logged in**
   - Redirected to shop page
   - User menu appears in navbar

#### Sign In
1. Sign out if signed in
2. Click "Sign In"
3. Enter credentials
4. Click "Sign in"
5. **Verify:** 
   - Logged in successfully
   - Redirected appropriately
   - User menu appears

#### Forgot Password (Demo)
1. Click "Sign In" → "Forgot password?"
2. **Verify:** Demo mode notice displays
3. Enter email
4. Click "Send Reset Link"
5. **Verify:** Success message appears (simulated)

#### Sign Out
1. Click user menu in navbar
2. Click "Logout"
3. **Verify:** 
   - Logged out
   - Redirected to home
   - User menu replaced with "Sign In"

---

### 6. Responsive Design ✅

#### Mobile (< 768px)
1. Resize browser to mobile width
2. **Verify:**
   - Hamburger menu appears
   - Mobile menu opens smoothly
   - All pages responsive
   - Cart drawer works
   - Forms display correctly

#### Tablet (768px - 1024px)
1. Resize browser to tablet width
2. **Verify:**
   - Layout adjusts properly
   - Grid columns reduce
   - Navigation still accessible

#### Desktop (> 1024px)
1. Full desktop view
2. **Verify:**
   - Full navigation visible
   - Multi-column layouts display
   - All features accessible

---

### 7. Error Handling ✅

#### Form Validation
1. Try to submit forms with:
   - Empty required fields
   - Invalid email format
   - Passwords that don't match
   - Short passwords (< 6 chars)
2. **Verify:** 
   - Inline error messages appear
   - Form doesn't submit
   - Toast notifications for errors

#### Protected Routes
1. Sign out
2. Try to access `/admin` directly
3. **Verify:** Redirected to sign-in page
4. Try to access `/my-orders` directly
5. **Verify:** Redirected to sign-in page

#### 404 Not Found
1. Navigate to non-existent page (e.g., `/invalid-page`)
2. **Verify:** 404 page displays with "Back to home" button

---

### 8. Data Persistence ✅

#### Cart Persistence
1. Add items to cart
2. Refresh page
3. **Verify:** Cart items still there

#### Authentication Persistence
1. Sign in
2. Refresh page
3. **Verify:** Still signed in

#### Product Persistence (Admin)
1. Create a new product as admin
2. Sign out
3. Sign back in
4. **Verify:** Product still exists

#### Order Persistence
1. Place an order
2. Sign out and sign back in
3. **Verify:** Order appears in order history

---

## 🐛 Known Expected Behaviors

### Not Bugs, By Design:

1. **Password Reset**: Shows demo message, doesn't actually send email
2. **Payment**: No payment processing, payment arranged after confirmation
3. **Email Confirmations**: Simulated, no actual emails sent
4. **Product Images**: Stored as base64 in browser (for demo purposes)
5. **All Data**: Stored in localStorage (no backend database)

---

## 📊 Performance Testing

### Check Performance:
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Run audit for:
   - Performance
   - Accessibility
   - Best Practices
   - SEO

**Expected Scores:**
- Performance: 80+ (acceptable for dev mode)
- Accessibility: 85+
- Best Practices: 90+
- SEO: 95+

---

## 🔍 Console Errors

### Expected Console Logs:
- **No red errors** should appear in console
- **Warnings** about fast-refresh are normal (development only)
- Any deprecation warnings from dependencies are non-critical

### To Check:
1. Open DevTools Console (F12)
2. Interact with the application
3. **Verify:** No red error messages

---

## ✅ Success Criteria

All tests pass if:

- ✅ All pages load without errors
- ✅ Toast notifications appear for actions
- ✅ Forms validate and submit correctly
- ✅ Products can be created/edited/deleted
- ✅ Orders can be placed and tracked
- ✅ Cart persists across page refreshes
- ✅ Authentication works correctly
- ✅ Admin dashboard is accessible
- ✅ Responsive on all screen sizes
- ✅ No console errors (red)
- ✅ All animations smooth

---

## 🚨 If Something Doesn't Work

### Troubleshooting Steps:

1. **Clear Browser Cache:**
   ```
   Chrome: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
   Select "Cached images and files"
   ```

2. **Clear localStorage:**
   ```
   Open DevTools Console
   Run: localStorage.clear()
   Refresh page
   ```

3. **Restart Dev Server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

4. **Rebuild:**
   ```bash
   npm run build
   ```

5. **Check Node Version:**
   ```bash
   node --version
   # Should be >= 20.x
   ```

---

## 📞 Reporting Issues

If you find any bugs or unexpected behavior, note:
1. What you were trying to do
2. What happened
3. What you expected to happen
4. Any console errors (screenshot)
5. Browser and version

---

## 🎉 Happy Testing!

Your Becute Dreams Luxe application is fully functional and ready to test. Enjoy exploring all the features!

**Questions?** Refer to:
- `FIXES_COMPLETED.md` - What was fixed
- `FRONTEND_AUDIT_REPORT.md` - Original issues found
- `ADMIN_ACCESS.md` - Admin credentials
- `README.md` - Project overview
