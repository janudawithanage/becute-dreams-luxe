# 🔐 Admin Access Quick Reference

## Admin Credentials

**URL:** http://localhost:5173/sign-in (or your deployment URL + `/sign-in`)

**Credentials:**
```
Email:    admin@becutedreams.com
Password: BecuteAdmin2024!
```

## Quick Access Steps

1. Navigate to the sign-in page (`/sign-in`)
2. The credentials are displayed on the page in a blue info box
3. Enter the email and password
4. Click "Sign In"
5. You'll be automatically redirected to the admin dashboard

## Admin Features

Once logged in as admin, you have access to:

- **Dashboard** (`/admin`) - Overview with stats, charts, and recent orders
- **Products** (`/admin/products`) - Manage product catalog
- **Orders** (`/admin/orders`) - View and manage orders
- **Customers** (`/admin/customers`) - Customer management
- **Settings** (`/admin/settings`) - Application settings

## Navigation

- **Desktop**: Click the "Admin" button (with shield icon) in the top navigation
- **Mobile**: Open menu and tap "Admin Dashboard"
- **Direct**: Navigate to `/admin` after logging in

## Logout

- **Main Site**: Click "Logout" button in navigation
- **Admin Area**: Click "Logout" in the sidebar user section
- You'll be redirected to the sign-in page

## Security Notes

⚠️ **Development Only** - These credentials are for development and testing purposes only.

The credentials are stored in `.env.local`:
```env
VITE_ADMIN_EMAIL=admin@becutedreams.com
VITE_ADMIN_PASSWORD=BecuteAdmin2024!
```

For production deployment:
- Remove the credential display from the sign-in page
- Implement proper backend authentication
- Use secure password hashing
- Set up proper environment variable management
- Consider adding rate limiting and other security measures

## Troubleshooting

**Can't access admin panel:**
- Make sure you're using the exact email and password (case-sensitive)
- Clear browser localStorage and try again
- Check that `.env.local` file exists in the project root
- Restart the development server after changing `.env.local`

**Logged out automatically:**
- The auth state is persisted in localStorage
- If you clear browser data, you'll need to sign in again

**Admin button not showing:**
- Make sure you logged in with the admin credentials
- Check that the user role is "admin" (not "customer")
