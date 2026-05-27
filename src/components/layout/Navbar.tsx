import { Link, useNavigate } from "@tanstack/react-router";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { ShoppingBag, Menu, X, Search, User, LogOut, LayoutDashboard } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const links = [
  { to: "/shop", label: "Shop" },
  { to: "/collections", label: "Collections" },
  { to: "/about", label: "Atelier" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const count = useCart((s) => s.count());
  const setCartOpen = useCart((s) => s.setOpen);
  const user = useAuth((s) => s.user);
  const role = useAuth((s) => s.role);
  const signOut = useAuth((s) => s.signOut);
  const navigate = useNavigate();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate({ to: "/" });
  };

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
          <Link to="/" className="group flex items-center gap-2">
            <span className="font-display text-2xl tracking-tight">
              Becute<span className="italic text-muted-foreground"> Dreams</span>
            </span>
          </Link>

          <div className="hidden items-center gap-10 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="group relative text-sm uppercase tracking-[0.18em] text-foreground/80 transition hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              aria-label="Search"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition hover:bg-foreground/5 md:flex"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition hover:bg-foreground/5"
            >
              <ShoppingBag className="h-4 w-4" />
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[10px] font-medium text-background"
                  style={{ background: "var(--ink)", color: "var(--background)" }}
                >
                  {count}
                </motion.span>
              )}
            </button>

            {/* Auth area */}
            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-label="Account menu"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition hover:bg-foreground/5"
                >
                  <User className="h-4 w-4" />
                </button>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-0 top-12 z-50 min-w-[180px] rounded-2xl bg-card shadow-luxe border border-border py-2"
                  >
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      <p className="text-xs font-medium uppercase tracking-wider mt-0.5 capitalize">{role}</p>
                    </div>
                    {role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        Admin panel
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign out
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden h-10 items-center justify-center rounded-full border border-foreground/20 px-5 text-xs uppercase tracking-[0.18em] text-foreground/80 transition hover:bg-foreground/5 md:flex"
              >
                Sign in
              </Link>
            )}

            <button
              aria-label="Menu"
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition hover:bg-foreground/5 md:hidden"
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
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 * links.length }}
              className="mt-4 border-t border-border pt-8"
            >
              {user ? (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 text-sm uppercase tracking-[0.18em]"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Admin panel
                    </Link>
                  )}
                  <button
                    onClick={() => { handleSignOut(); setOpen(false); }}
                    className="flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="text-sm uppercase tracking-[0.18em]"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="text-sm uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    Create account
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  );
}
