import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Mail } from "lucide-react";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomers,
});

interface Customer {
  id: string;
  name: string;
  email: string;
  joined: string;
  orders: number;
  spent: number;
}

const CUSTOMERS: Customer[] = [
  { id: "c1", name: "Aiko Tanaka", email: "aiko@example.com", joined: "Jan 12, 2026", orders: 8, spent: 412 },
  { id: "c2", name: "Maya Chen", email: "maya@example.com", joined: "Feb 03, 2026", orders: 3, spent: 86 },
  { id: "c3", name: "Ines Moreau", email: "ines@example.com", joined: "Mar 21, 2026", orders: 12, spent: 1024 },
  { id: "c4", name: "Sofia Rossi", email: "sofia@example.com", joined: "Apr 02, 2026", orders: 4, spent: 156 },
  { id: "c5", name: "Lila Park", email: "lila@example.com", joined: "Apr 18, 2026", orders: 6, spent: 232 },
  { id: "c6", name: "Eva Lindgren", email: "eva@example.com", joined: "May 04, 2026", orders: 2, spent: 76 },
  { id: "c7", name: "Yuna Park", email: "yuna@example.com", joined: "May 14, 2026", orders: 1, spent: 22 },
  { id: "c8", name: "Noah Kim", email: "noah@example.com", joined: "May 18, 2026", orders: 1, spent: 44 },
];

function AdminCustomers() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      CUSTOMERS.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.email.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <div className="mx-auto max-w-[1400px] space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Community</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight lg:text-5xl">Customers</h1>
      </div>

      <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2.5 sm:max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <th className="px-6 py-4 font-normal">Customer</th>
                <th className="px-6 py-4 font-normal">Joined</th>
                <th className="px-6 py-4 text-center font-normal">Orders</th>
                <th className="px-6 py-4 text-right font-normal">Lifetime value</th>
                <th className="px-6 py-4 text-right font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.id} className="transition hover:bg-muted/20">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
                        {c.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                      <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{c.joined}</td>
                  <td className="px-6 py-4 text-center tabular-nums">{c.orders}</td>
                  <td className="px-6 py-4 text-right tabular-nums">${c.spent.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <a
                        href={`mailto:${c.email}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
                        aria-label="Email"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="px-6 py-16 text-center text-muted-foreground">
            No customers match this search.
          </div>
        )}
      </div>
    </div>
  );
}
