import type { Product } from "../products/products.types";

export interface CartItem {
  product: Product;
  qty: number;
}

export interface CartState {
  items: CartItem[];
  open: boolean;
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  setOpen: (v: boolean) => void;
  count: () => number;
  total: () => number;
}
