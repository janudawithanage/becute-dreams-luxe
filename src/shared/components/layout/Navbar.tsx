import { Link } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, Search, User, Shield } from "lucide-react";
import { useCart } from "@/features/cart";
import { useAuthStore } from "@/features/auth";
import { cn } from "@/shared/utils";

const links = [
  { to: "/shop", label: "Shop" },
  { to: "/collections", label: "Collections" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const count = useCart((s) => s.count());
  const setCartOpen = useCart((s) => s.setOpen);
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "glass shadow-soft" : "bg-transparent",
        )}
      >
        <nav className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 lg:px-12">
          {/* Logo - Left */}
          <Link to="/" className="group flex items-center gap-2 flex-shrink-0">
            <span className="font-display text-2xl tracking-tight">
              Becute<span className="italic text-muted-foreground"> Dreams</span>
            </span>
          </Link>

          {/* Navigation Links - Center on Desktop */}
          <div className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="group relative text-sm uppercase tracking-[0.18em] text-foreground/80 transition hover:text-foreground"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Actions - Right */}
          <div className="flex items-center gap-1">
            {/* Search - Desktop only */}
            <button
              aria-label="Search"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground md:flex"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Sign In / User Menu - Desktop only */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-1">
                {!isAdmin() && (
                  <Link
                    to="/my-orders"
                    className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm uppercase tracking-[0.15em] text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>My Orders</span>
                  </Link>
                )}
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm uppercase tracking-[0.15em] text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm uppercase tracking-[0.15em] text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground"
                >
                  <User className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/sign-in"
                className="hidden items-center gap-1.5 rounded-full px-4 py-2 text-sm uppercase tracking-[0.15em] text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground md:flex"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Cart - All screens */}
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground"
            >
              <ShoppingBag className="h-4 w-4" />
              {mounted && count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-medium text-background"
                  style={{ background: "var(--ink)", color: "var(--background)" }}
                >
                  {count}
                </motion.span>
              )}
            </button>

            {/* Mobile Menu - Mobile only */}
            <button
              aria-label="Menu"
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex flex-col bg-background px-6 py-6 md:hidden"
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl">Becute Dreams</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-16 flex flex-col gap-8">
            {/* Main Navigation Links */}
            {links.map((l, i) => (
              <motion.div
                key={l.to}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 * i }}
              >
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="font-display text-5xl tracking-tight"
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="border-t border-border"
            />

            {/* Secondary Links */}
            {isAuthenticated ? (
              <>
                {!isAdmin() && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      to="/my-orders"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 text-xl font-medium"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      <span>My Orders</span>
                    </Link>
                  </motion.div>
                )}
                {isAdmin() && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 text-xl font-medium"
                    >
                      <Shield className="h-5 w-5" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </motion.div>
                )}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 text-xl font-medium"
                  >
                    <User className="h-5 w-5" />
                    <span>Logout ({user?.email})</span>
                  </button>
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  to="/sign-in"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 text-xl font-medium"
                >
                  <User className="h-5 w-5" />
                  <span>Sign In</span>
                </Link>
              </motion.div>
            )}

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isAuthenticated ? 0.4 : 0.35 }}
            >
              <button
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 text-xl font-medium text-muted-foreground"
              >
                <Search className="h-5 w-5" />
                <span>Search</span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  );
}
