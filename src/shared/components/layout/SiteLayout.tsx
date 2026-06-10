import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "../../../features/cart/components/CartDrawer";

export function SiteLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    // Admin section provides its own layout (sidebar + topbar).
    return <Outlet />;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
