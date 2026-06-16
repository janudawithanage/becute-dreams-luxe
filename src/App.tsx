import { Routes, Route } from "react-router-dom";
import { SiteLayout } from "@/shared/components/layout/SiteLayout";
import { ProtectedRoute } from "@/shared/components/auth/ProtectedRoute";
import { Home } from "@/pages/Home";
import { Shop } from "@/pages/Shop";
import { ProductDetail } from "@/pages/ProductDetail";
import { Collections } from "@/pages/Collections";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { Checkout } from "@/pages/Checkout";
import { SignIn } from "@/pages/SignIn";
import { SignUp } from "@/pages/SignUp";
import { ForgotPassword } from "@/pages/ForgotPassword";
import { NotFound } from "@/pages/NotFound";

// Admin pages
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Dashboard } from "@/pages/admin/Dashboard";
import { Products } from "@/pages/admin/Products";
import { ProductForm } from "@/pages/admin/ProductForm";
import { Orders } from "@/pages/admin/Orders";
import { OrderDetail } from "@/pages/admin/OrderDetail";
import { Customers } from "@/pages/admin/Customers";
import { Settings } from "@/pages/admin/Settings";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin routes - Protected */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="customers" element={<Customers />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
