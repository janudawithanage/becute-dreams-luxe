import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden bg-gradient-ink text-background">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 py-24 lg:grid-cols-4 lg:px-12">
        <div className="lg:col-span-2">
          <h3 className="font-display text-5xl tracking-tight lg:text-6xl">
            Dream <em className="font-light">softly.</em>
            <br />
            Live <em className="font-light">beautifully.</em>
          </h3>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-background/60">
            A modern boutique for the quietly creative. Each Becute piece is designed, printed and
            finished in small batches.
          </p>
        </div>

        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.25em] text-background/40">Shop</p>
          <ul className="space-y-3 text-sm text-background/80">
            <li>
              <Link to="/shop" className="hover:text-background">
                All stickers
              </Link>
            </li>
            <li>
              <Link to="/collections" className="hover:text-background">
                Collections
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-background">
                New arrivals
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-background">
                Custom orders
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.25em] text-background/40">Atelier</p>
          <ul className="space-y-3 text-sm text-background/80">
            <li>
              <Link to="/about" className="hover:text-background">
                Our story
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-background">
                Contact
              </Link>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-background"
              >
                <Instagram className="h-4 w-4" /> Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-4 border-t border-background/10 px-6 py-8 text-xs uppercase tracking-[0.2em] text-background/40 md:flex-row md:items-center lg:px-12">
        <span>© {new Date().getFullYear()} Becute Dreams · Crafted with care</span>
        <span>Worldwide soft shipping</span>
      </div>

      {/* Oversized brand mark */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[clamp(8rem,22vw,22rem)] leading-none tracking-tighter text-background/[0.04]"
      >
        becute · dreams
      </div>
    </footer>
  );
}
