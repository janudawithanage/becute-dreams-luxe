import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/utils/cn";
import { motion } from "framer-motion";
import { useAuthStore } from "@/features/auth";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/sign-in");
  };

  return (
    <div className="min-h-screen bg-gradient-dream relative">
      {/* Soft floating orbs - background decoration */}
      <div
        aria-hidden
        className="pointer-events-none fixed -left-32 top-20 h-96 w-96 rounded-full bg-blush/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-lavender/30 blur-3xl"
      />

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 glass border-r border-foreground/10 transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center justify-between border-b border-foreground/10 px-6">
            <Link to="/" className="group flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blush" />
              <span className="font-display text-xl tracking-tight">
                Becute<span className="italic text-muted-foreground"> Admin</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-muted-foreground hover:text-foreground transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-6">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-gradient-ink text-background shadow-soft"
                      : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="uppercase tracking-[0.15em]">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-foreground/10 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gradient-blush flex items-center justify-center shadow-soft">
                <span className="text-sm font-display text-ink">
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || "admin@becute.com"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/70 hover:bg-foreground/5 hover:text-foreground transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span className="uppercase tracking-[0.15em]">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass border-b border-foreground/10">
          <div className="flex h-20 items-center gap-4 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-foreground/70 hover:text-foreground transition"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1">
              <h1 className="font-display text-2xl tracking-tight text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mt-0.5">
                ✦ Manage your boutique
              </p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 lg:p-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
