import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "@/features/cart";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";

export function Checkout() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  if (items.length === 0 && !placed) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <p className="font-display text-4xl">Your basket is empty.</p>
        <Link
          to="/shop"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-foreground px-8 text-xs uppercase tracking-[0.25em] text-background"
        >
          Discover stickers
        </Link>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Order received</p>
        <h1 className="mt-6 font-display text-6xl leading-tight tracking-tight">
          A soft thank you, <em className="font-light">{form.name.split(" ")[0] || "friend"}.</em>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-base text-foreground/70">
          Your order is pending confirmation. We'll reach out shortly to confirm details and
          shipping.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Hi Becute Dreams! I just placed an order under ${form.name}.`)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-7 text-xs uppercase tracking-[0.25em] text-background"
          >
            <MessageCircle className="h-4 w-4" /> Message on WhatsApp
          </a>
          <Link
            to="/shop"
            className="inline-flex h-12 items-center rounded-full border border-foreground/20 px-7 text-xs uppercase tracking-[0.25em]"
          >
            Keep shopping
          </Link>
        </div>
      </div>
    );
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const orderItems = items.map((i) => ({
      id: i.product.id,
      slug: i.product.slug,
      name: i.product.name,
      price: i.product.price,
      qty: i.qty,
    }));

    const orderData = {
      cart: orderItems,
      customer: { name: form.name, phone: form.phone, address: form.address },
      total: total(),
    };

    // Simulate order placement (no backend)
    console.log("Order placed:", orderData);
    toast.success("Order details saved locally");

    setPlaced(true);
    clear();
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">
      <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Checkout</p>
      <h1 className="mt-3 font-display text-5xl tracking-tight lg:text-7xl">
        A few <em className="font-light">soft details.</em>
      </h1>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <form onSubmit={submit} className="space-y-6 lg:col-span-7">
          <div>
            <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Full name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-2 h-14 w-full rounded-2xl border bg-background px-5 text-base outline-none focus:border-foreground"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Phone number
            </label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-2 h-14 w-full rounded-2xl border bg-background px-5 text-base outline-none focus:border-foreground"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Delivery address
            </label>
            <textarea
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={4}
              className="mt-2 w-full rounded-2xl border bg-background p-5 text-base outline-none focus:border-foreground"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-14 w-full items-center justify-center rounded-full bg-foreground px-8 text-xs uppercase tracking-[0.25em] text-background transition hover:scale-[1.01]"
          >
            Place order
          </button>
          <p className="text-xs text-muted-foreground">
            Payment is arranged after confirmation. No card needed today.
          </p>
        </form>

        <aside className="lg:col-span-5">
          <div className="rounded-3xl bg-muted p-8">
            <h2 className="font-display text-2xl">Order summary</h2>
            <div className="mt-6 space-y-4">
              {items.map((i) => (
                <div key={i.product.id} className="flex items-center gap-4">
                  <img
                    src={i.product.image}
                    alt={i.product.name}
                    className="h-16 w-14 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-display text-base leading-tight">{i.product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty {i.qty}</p>
                  </div>
                  <p className="text-sm tabular-nums">${(i.product.price * i.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t pt-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${total().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>Calculated at confirmation</span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Total
                </span>
                <span className="font-display text-3xl">${total().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
