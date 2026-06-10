# Admin Dashboard

A comprehensive admin dashboard for managing the BeCute Dreams Luxe e-commerce store.

## Features

### Dashboard (/)

- Overview statistics cards (Revenue, Orders, Products, Customers)
- Revenue and orders charts
- Recent orders list
- Trend indicators

### Products (/admin/products)

- Product listing with search
- Product details (image, SKU, category, price, stock, status)
- Quick actions (view, edit, delete)
- Low stock indicators
- Status badges (active, draft, archived)

### Orders (/admin/orders)

- Order management with search
- Order details view
- Status tracking (pending, processing, shipped, delivered, cancelled)
- Order timeline visualization
- Customer information
- Order items breakdown
- Invoice printing

### Customers (/admin/customers)

- Customer listing with search
- Customer statistics
- Contact information
- Order history per customer
- Total spent tracking
- Customer status

### Settings (/admin/settings)

Multiple configuration tabs:

- **General**: Store name, email, phone
- **Store**: Store status, maintenance mode, currency, timezone
- **Notifications**: Email preferences for orders, stock alerts, inquiries
- **Shipping**: Free shipping threshold, shipping rates, international shipping

## Components Used

### UI Components

- Card
- Table
- Badge
- Button
- Input
- Label
- Tabs
- Switch
- Select
- Textarea

### Charts

- Line Chart (Revenue)
- Bar Chart (Orders)
- Uses Recharts library

## Navigation

The dashboard uses a fixed sidebar with the following sections:

- Dashboard
- Products
- Orders
- Customers
- Settings

## Mock Data

All data is currently mocked in `/features/admin/admin.data.ts`:

- Dashboard statistics
- Sales data
- Orders
- Customers
- Products

## Responsive Design

- Mobile-friendly sidebar (collapsible)
- Responsive grid layouts
- Adaptive table displays
- Touch-friendly controls

## Future Enhancements

- Real backend API integration
- Advanced filtering and sorting
- Bulk actions
- Product image management
- Analytics dashboard
- Customer segments
- Marketing campaigns
- Discount codes management
- Inventory management
- Report generation
