import { Outlet, useRouterState } from "@tanstack/react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "../../../features/cart/components/CartDrawer";

export function SiteLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

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
