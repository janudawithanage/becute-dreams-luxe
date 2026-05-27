import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
} from "lucide-react";
import { products } from "@/lib/products";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const STATS = [
  { label: "Revenue", value: "$24,318", delta: "+12.4%", icon: DollarSign },
  { label: "Orders", value: "428", delta: "+8.2%", icon: ShoppingBag },
  { label: "Customers", value: "1,294", delta: "+3.1%", icon: Users },
  { label: "Avg. order", value: "$56.80", delta: "+1.6%", icon: TrendingUp },
];

const RECENT_ORDERS = [
  { id: "ORD-1042", customer: "Aiko Tanaka", total: 56.0, status: "Fulfilled", date: "May 26" },
  { id: "ORD-1041", customer: "Maya Chen", total: 18.0, status: "Processing", date: "May 26" },
  { id: "ORD-1040", customer: "Ines Moreau", total: 124.0, status: "Pending", date: "May 25" },
  { id: "ORD-1039", customer: "Sofia Rossi", total: 32.0, status: "Fulfilled", date: "May 25" },
  { id: "ORD-1038", customer: "Lila Park", total: 76.0, status: "Fulfilled", date: "May 24" },
];

function AdminDashboard() {
  const topProducts = products.slice(0, 4);

  return (
    <div className="mx-auto max-w-[1400px] space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Overview</p>
          <h1 className="mt-2 font-display text-4xl tracking-tight lg:text-5xl">
            Good morning<em className="font-light text-muted-foreground">.</em>
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Here's what's been happening across the atelier.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-start justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {s.label}
                </p>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <p className="mt-6 font-display text-3xl tracking-tight">{s.value}</p>
              <p className="mt-1 text-xs text-emerald-600">{s.delta} this month</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent orders */}
        <div className="rounded-2xl border border-border bg-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-display text-lg">Recent orders</h2>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {RECENT_ORDERS.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between px-6 py-4 text-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{o.customer}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.id} · {o.date}
                  </p>
                </div>
                <StatusBadge status={o.status} />
                <p className="ml-6 w-20 text-right tabular-nums">${o.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-display text-lg">Top products</h2>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
            >
              Manage <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {topProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-6 py-4">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs capitalize text-muted-foreground">{p.category}</p>
                </div>
                <p className="text-sm tabular-nums">${p.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <QuickAction to="/admin/products" icon={Package} title="Add product" desc="Bring something new to the shelf." />
        <QuickAction to="/admin/orders" icon={ShoppingBag} title="Review orders" desc="Process pending fulfilment." />
        <QuickAction to="/admin/customers" icon={Users} title="Customers" desc="Browse the community." />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Fulfilled: "bg-emerald-50 text-emerald-700",
    Processing: "bg-amber-50 text-amber-700",
    Pending: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`hidden rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] sm:inline ${map[status] ?? ""}`}
    >
      {status}
    </span>
  );
}

function QuickAction({
  to,
  icon: Icon,
  title,
  desc,
}: {
  to: "/admin/products" | "/admin/orders" | "/admin/customers";
  icon: typeof Package;
  title: string;
  desc: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition hover:shadow-soft"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition group-hover:scale-105">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      </div>
      <ArrowUpRight className="mt-1 h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
    </Link>
  );
}
