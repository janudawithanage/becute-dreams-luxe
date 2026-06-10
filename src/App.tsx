import { Routes, Route } from 'react-router-dom';
import { SiteLayout } from '@/shared/components/layout/SiteLayout';
import { Home } from '@/pages/Home';
import { Shop } from '@/pages/Shop';
import { ProductDetail } from '@/pages/ProductDetail';
import { Collections } from '@/pages/Collections';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { Checkout } from '@/pages/Checkout';
import { SignIn } from '@/pages/SignIn';
import { SignUp } from '@/pages/SignUp';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { NotFound } from '@/pages/NotFound';

export default function App() {
  return (
    <Routes>
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
    </Routes>
  );
}
