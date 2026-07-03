import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const shopLinks = [
  { to: "/shop", label: "All stickers" },
  { to: "/collections", label: "Collections" },
  { to: "/shop", label: "New arrivals" },
  { to: "/shop", label: "Custom orders" },
];

const atelierLinks = [
  { to: "/about", label: "Our story" },
  { to: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden bg-gradient-ink text-background">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 py-24 lg:grid-cols-4 lg:px-12">
        {/* Brand column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease }}
          className="lg:col-span-2"
        >
          <h3 className="font-display text-5xl tracking-tight lg:text-6xl">
            Dream <em className="font-light">softly.</em>
            <br />
            Live <em className="font-light">beautifully.</em>
          </h3>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-background/60">
            A modern boutique for the quietly creative. Each Becute piece is designed, printed and
            finished in small batches with intention and care.
          </p>
          <a
            href="https://www.instagram.com/becute_dreams?igsh=cHExODhycW5obXo3"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-background/50 transition hover:text-background"
          >
            <Instagram className="h-4 w-4" />
            @becute_dreams
          </a>
        </motion.div>

        {/* Shop links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease, delay: 0.1 }}
        >
          <p className="mb-5 text-xs uppercase tracking-[0.25em] text-background/40">Shop</p>
          <ul className="space-y-3">
            {shopLinks.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-sm text-background/70 transition hover:text-background link-underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Atelier links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease, delay: 0.18 }}
        >
          <p className="mb-5 text-xs uppercase tracking-[0.25em] text-background/40">Atelier</p>
          <ul className="space-y-3">
            {atelierLinks.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-sm text-background/70 transition hover:text-background link-underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://www.instagram.com/becute_dreams?igsh=cHExODhycW5obXo3"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-background/70 transition hover:text-background"
              >
                <Instagram className="h-3.5 w-3.5" />
                Instagram
              </a>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-4 border-t border-background/10 px-6 py-8 text-xs uppercase tracking-[0.2em] text-background/40 md:flex-row md:items-center lg:px-12">
        <span>© {new Date().getFullYear()} Becute Dreams · Crafted with care</span>
        <span>Worldwide soft shipping</span>
      </div>

      {/* Oversized watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[clamp(8rem,22vw,22rem)] leading-none tracking-tighter text-background/[0.035]"
      >
        becute · dreams
      </div>
    </footer>
  );
}
