import { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import { SiteLayout } from "@/shared/components/layout/SiteLayout";
import { ProtectedRoute } from "@/shared/components/auth/ProtectedRoute";
import { Toaster } from "@/shared/components/ui/sonner";
import { useAuthStore } from '@/features/auth';
import { useCart } from '@/features/cart';
import './test-env';
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
import { MyOrders } from "@/pages/MyOrders";
import { OrderDetail } from "@/pages/OrderDetail";
import { Account } from "@/pages/Account";
import { NotFound } from "@/pages/NotFound";

// Admin pages
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Dashboard } from "@/pages/admin/Dashboard";
import { Products } from "@/pages/admin/Products";
import { ProductForm } from "@/pages/admin/ProductForm";
import { AdminCategories } from "@/pages/admin/AdminCategories";
import { CategoryForm } from "@/pages/admin/CategoryForm";
import { AdminCollections } from "@/pages/admin/AdminCollections";
import { CollectionForm } from "@/pages/admin/CollectionForm";
import { Orders } from "@/pages/admin/Orders";
import { OrderDetail as AdminOrderDetail } from "@/pages/admin/OrderDetail";
import { Customers } from "@/pages/admin/Customers";
import { Settings } from "@/pages/admin/Settings";

export default function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const user = useAuthStore((state) => state.user);
  const loadCart = useCart((state) => state.loadCart);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user, loadCart]);

  return (
    <>
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
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/order/:orderId" element={<OrderDetail />} />
          <Route path="/account" element={<Account />} />
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
          <Route path="categories" element={<AdminCategories />} />
          <Route path="categories/new" element={<CategoryForm />} />
          <Route path="categories/:id/edit" element={<CategoryForm />} />
          <Route path="collections" element={<AdminCollections />} />
          <Route path="collections/new" element={<CollectionForm />} />
          <Route path="collections/:id/edit" element={<CollectionForm />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}
