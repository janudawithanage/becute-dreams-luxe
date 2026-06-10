import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartState } from "./cart.types";

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,
      add: (p, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.product.id === p.id);
          if (existing) {
            return {
              items: s.items.map((i) => (i.product.id === p.id ? { ...i, qty: i.qty + qty } : i)),
              open: true,
            };
          }
          return { items: [...s.items, { product: p, qty }], open: true };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.product.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.product.id === id ? { ...i, qty: Math.max(1, qty) } : i))
            .filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [] }),
      setOpen: (v) => set({ open: v }),
      count: () => get().items.reduce((n, i) => n + i.qty, 0),
      total: () => get().items.reduce((n, i) => n + i.qty * i.product.price, 0),
    }),
    { name: "becute-cart" },
  ),
);
