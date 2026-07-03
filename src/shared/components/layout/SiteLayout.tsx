import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "../../../features/cart/components/CartDrawer";

const ease = [0.22, 1, 0.36, 1] as const;

export function SiteLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  // Scroll to top on every route change (and on initial page load)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  if (isAdmin) {
    return <Outlet />;
  }

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease }}
          className="min-h-screen pt-20"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <CartDrawer />
    </>
  );
}
