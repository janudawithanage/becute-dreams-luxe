import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-dream px-4">
      {/* Floating orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full blur-3xl"
        style={{ background: "color-mix(in oklab, var(--blush) 35%, transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full blur-3xl"
        style={{ background: "color-mix(in oklab, var(--lavender) 35%, transparent)" }}
      />

      <div className="relative max-w-md text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease }}
        >
          <h1 className="font-display text-[10rem] leading-none tracking-tighter text-foreground/10">
            404
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
          className="-mt-8 space-y-4"
        >
          <p className="font-display text-3xl tracking-tight">This page is dreaming elsewhere.</p>
          <p className="text-sm text-muted-foreground">
            It may have moved, or perhaps it never existed. Let's bring you somewhere soft.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-2.5 rounded-full bg-foreground pl-6 pr-3 py-3 text-xs uppercase tracking-[0.25em] text-background transition hover:scale-[1.02]"
          >
            Return home
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-foreground transition group-hover:rotate-45">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            to="/shop"
            className="inline-flex h-12 items-center rounded-full border border-foreground/20 px-6 text-xs uppercase tracking-[0.25em] text-foreground/80 transition hover:border-foreground hover:text-foreground"
          >
            Browse shop
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
