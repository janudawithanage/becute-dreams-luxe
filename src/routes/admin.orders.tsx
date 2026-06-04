import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Search, Filter, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: string;
  date: string;
}

interface DbOrder {
  id: string;
  user_id: string;
  items: { cart?: { qty: number }[]; customer?: CustomerInfo } | null;
  total: number;
  status: string;
  created_at: string | null;
}

const FILTERS = ["all", "pending", "processing", "fulfilled", "cancelled"] as const;

function toOrder(o: DbOrder): Order {
  const customer = o.items?.customer;
  const cart = o.items?.cart;
  return {
    id: o.id.slice(0, 8).toUpperCase(),
    customer: customer?.name ?? "Unknown",
    email: "",
    items: cart?.reduce((n, i) => n + (i.qty ?? 0), 0) ?? 0,
    total: o.total,
    status: o.status,
    date: o.created_at
      ? new Date(o.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—",
  };
}

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  useEffect(() => {
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("[admin] Failed to fetch orders:", error);
          setOrders([]);
        } else {
          setOrders((data as DbOrder[]).map(toOrder));
        }
        setFetching(false);
      });
  }, []);

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        if (filter !== "all" && o.status !== filter) return false;
        if (
          query &&
          !o.customer.toLowerCase().includes(query.toLowerCase()) &&
          !o.id.toLowerCase().includes(query.toLowerCase())
        )
          return false;
        return true;
      }),
    [orders, query, filter],
  );

  return (
    <div className="mx-auto max-w-[1400px] space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Fulfilment</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight lg:text-5xl">Orders</h1>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2.5 sm:max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order or customer"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] capitalize transition ${
                filter === f
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card hover:border-foreground/40"
              }`}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
      </div>

      {fetching ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <th className="px-6 py-4 font-normal">Order</th>
                  <th className="px-6 py-4 font-normal">Customer</th>
                  <th className="px-6 py-4 font-normal">Date</th>
                  <th className="px-6 py-4 text-center font-normal">Items</th>
                  <th className="px-6 py-4 font-normal">Status</th>
                  <th className="px-6 py-4 text-right font-normal">Total</th>
                  <th className="px-6 py-4 text-right font-normal">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((o) => (
                  <tr key={o.id} className="transition hover:bg-muted/20">
                    <td className="px-6 py-4 font-mono text-xs">{o.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{o.customer}</p>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{o.date}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{o.items}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums">${o.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
                          aria-label="View"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="px-6 py-16 text-center text-muted-foreground">
              No orders match these filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    fulfilled: "bg-emerald-50 text-emerald-700",
    processing: "bg-amber-50 text-amber-700",
    pending: "bg-muted text-muted-foreground",
    cancelled: "bg-rose-50 text-rose-700",
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${map[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  );
}
