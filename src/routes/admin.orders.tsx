import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Filter, Eye } from "lucide-react";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

interface Order {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: "Pending" | "Processing" | "Fulfilled" | "Cancelled";
  date: string;
}

const ORDERS: Order[] = [
  { id: "ORD-1042", customer: "Aiko Tanaka", email: "aiko@example.com", items: 2, total: 56, status: "Fulfilled", date: "May 26, 2026" },
  { id: "ORD-1041", customer: "Maya Chen", email: "maya@example.com", items: 1, total: 18, status: "Processing", date: "May 26, 2026" },
  { id: "ORD-1040", customer: "Ines Moreau", email: "ines@example.com", items: 4, total: 124, status: "Pending", date: "May 25, 2026" },
  { id: "ORD-1039", customer: "Sofia Rossi", email: "sofia@example.com", items: 1, total: 32, status: "Fulfilled", date: "May 25, 2026" },
  { id: "ORD-1038", customer: "Lila Park", email: "lila@example.com", items: 3, total: 76, status: "Fulfilled", date: "May 24, 2026" },
  { id: "ORD-1037", customer: "Noah Kim", email: "noah@example.com", items: 2, total: 44, status: "Cancelled", date: "May 23, 2026" },
  { id: "ORD-1036", customer: "Eva Lindgren", email: "eva@example.com", items: 5, total: 152, status: "Fulfilled", date: "May 22, 2026" },
  { id: "ORD-1035", customer: "Yuna Park", email: "yuna@example.com", items: 1, total: 22, status: "Processing", date: "May 22, 2026" },
];

const FILTERS = ["all", "Pending", "Processing", "Fulfilled", "Cancelled"] as const;

function AdminOrders() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  const filtered = useMemo(
    () =>
      ORDERS.filter((o) => {
        if (filter !== "all" && o.status !== filter) return false;
        if (
          query &&
          !o.customer.toLowerCase().includes(query.toLowerCase()) &&
          !o.id.toLowerCase().includes(query.toLowerCase())
        )
          return false;
        return true;
      }),
    [query, filter],
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
                    <p className="text-xs text-muted-foreground">{o.email}</p>
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
    </div>
  );
}

function StatusBadge({ status }: { status: Order["status"] }) {
  const map: Record<Order["status"], string> = {
    Fulfilled: "bg-emerald-50 text-emerald-700",
    Processing: "bg-amber-50 text-amber-700",
    Pending: "bg-muted text-muted-foreground",
    Cancelled: "bg-rose-50 text-rose-700",
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${map[status]}`}
    >
      {status}
    </span>
  );
}
