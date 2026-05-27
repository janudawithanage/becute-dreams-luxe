import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export function AdminShell() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useAuth((s) => s.user);
  const role = useAuth((s) => s.role);
  const loading = useAuth((s) => s.loading);
  const signOut = useAuth((s) => s.signOut);

  const [mobileOpen, setMobileOpen] = useState(false);

  // Guard: only admin users may stay here.
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login", search: { redirect: pathname } });
      return;
    }
    if (role !== "admin") {
      navigate({ to: "/" });
    }
  }, [user, role, loading, navigate, pathname]);

  // While bootstrapping the session, show a calm loading state.
  if (loading || !user || role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
        <SidebarContent
          pathname={pathname}
          isActive={isActive}
          email={user.email ?? ""}
          onSignOut={handleSignOut}
        />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
            className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-border bg-card"
          >
            <SidebarContent
              pathname={pathname}
              isActive={isActive}
              email={user.email ?? ""}
              onSignOut={handleSignOut}
              onNavigate={() => setMobileOpen(false)}
            />
          </motion.aside>
        </motion.div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 transition hover:bg-foreground/5 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Atelier Console
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden text-xs uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground sm:inline"
            >
              View site →
            </Link>
            <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-[11px] font-medium text-background">
                {(user.email?.[0] ?? "A").toUpperCase()}
              </span>
              <span className="hidden max-w-[160px] truncate text-xs text-muted-foreground sm:inline">
                {user.email}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  isActive,
  email,
  onSignOut,
  onNavigate,
}: {
  pathname: string;
  isActive: (to: string, exact?: boolean) => boolean;
  email: string;
  onSignOut: () => void;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link to="/admin" onClick={onNavigate} className="font-display text-xl tracking-tight">
          Becute<span className="italic text-muted-foreground"> Admin</span>
        </Link>
        {onNavigate && (
          <button
            onClick={onNavigate}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/70 hover:bg-foreground/5 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to, "exact" in item ? item.exact : false);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                active
                  ? "bg-foreground text-background"
                  : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="mb-2 px-3 py-2">
          <p className="truncate text-xs text-muted-foreground">{email}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
            Administrator
          </p>
        </div>
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground/70 transition hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
