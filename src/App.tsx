import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from "react-router-dom";
import { SiteLayout } from "@/shared/components/layout/SiteLayout";
import { ProtectedRoute } from "@/shared/components/auth/ProtectedRoute";
import { Toaster } from "@/shared/components/ui/sonner";
import { useAuthStore } from '@/features/auth';
import { useCart } from '@/features/cart';
import './test-env';

// Public pages — lazy loaded so each route gets its own chunk
const Home = lazy(() => import("@/pages/Home").then(m => ({ default: m.Home })));
const Shop = lazy(() => import("@/pages/Shop").then(m => ({ default: m.Shop })));
const ProductDetail = lazy(() => import("@/pages/ProductDetail").then(m => ({ default: m.ProductDetail })));
const Collections = lazy(() => import("@/pages/Collections").then(m => ({ default: m.Collections })));
const About = lazy(() => import("@/pages/About").then(m => ({ default: m.About })));
const Contact = lazy(() => import("@/pages/Contact").then(m => ({ default: m.Contact })));
const Checkout = lazy(() => import("@/pages/Checkout").then(m => ({ default: m.Checkout })));
const SignIn = lazy(() => import("@/pages/SignIn").then(m => ({ default: m.SignIn })));
const SignUp = lazy(() => import("@/pages/SignUp").then(m => ({ default: m.SignUp })));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword").then(m => ({ default: m.ForgotPassword })));
const MyOrders = lazy(() => import("@/pages/MyOrders").then(m => ({ default: m.MyOrders })));
const OrderDetail = lazy(() => import("@/pages/OrderDetail").then(m => ({ default: m.OrderDetail })));
const Account = lazy(() => import("@/pages/Account").then(m => ({ default: m.Account })));
const NotFound = lazy(() => import("@/pages/NotFound").then(m => ({ default: m.NotFound })));

// Admin pages — all in one async chunk since they share the AdminLayout
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard").then(m => ({ default: m.Dashboard })));
const Products = lazy(() => import("@/pages/admin/Products").then(m => ({ default: m.Products })));
const ProductForm = lazy(() => import("@/pages/admin/ProductForm").then(m => ({ default: m.ProductForm })));
const AdminCategories = lazy(() => import("@/pages/admin/AdminCategories").then(m => ({ default: m.AdminCategories })));
const CategoryForm = lazy(() => import("@/pages/admin/CategoryForm").then(m => ({ default: m.CategoryForm })));
const AdminCollections = lazy(() => import("@/pages/admin/AdminCollections").then(m => ({ default: m.AdminCollections })));
const CollectionForm = lazy(() => import("@/pages/admin/CollectionForm").then(m => ({ default: m.CollectionForm })));
const AdminGallery = lazy(() => import("@/pages/admin/AdminGallery").then(m => ({ default: m.AdminGallery })));
const GalleryForm = lazy(() => import("@/pages/admin/GalleryForm").then(m => ({ default: m.GalleryForm })));
const AdminOrders = lazy(() => import("@/pages/admin/Orders").then(m => ({ default: m.Orders })));
const AdminOrderDetail = lazy(() => import("@/pages/admin/OrderDetail").then(m => ({ default: m.OrderDetail })));
const Customers = lazy(() => import("@/pages/admin/Customers").then(m => ({ default: m.Customers })));
const CustomerDetail = lazy(() => import("@/pages/admin/CustomerDetail").then(m => ({ default: m.CustomerDetail })));
const Settings = lazy(() => import("@/pages/admin/Settings").then(m => ({ default: m.Settings })));

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
      <Suspense fallback={null}>
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
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="gallery/new" element={<GalleryForm />} />
            <Route path="gallery/:id/edit" element={<GalleryForm />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:id" element={<AdminOrderDetail />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}
