import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import hero from "@/assets/hero.jpg";
import { ArrowUpRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-dream pb-24 pt-12 lg:pb-32">
      {/* Soft floating orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-blush/40 blur-3xl"
        style={{ background: "color-mix(in oklab, var(--blush) 50%, transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{ background: "color-mix(in oklab, var(--lavender) 50%, transparent)" }}
      />

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12 lg:gap-8 lg:px-12">
        <div className="lg:col-span-6">
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease }}
            className="text-xs uppercase tracking-[0.35em] text-muted-foreground"
          >
            ✦ A boutique of small joys
          </motion.p>
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease, delay: 0.1 }}
            className="mt-6 font-display text-[clamp(3.5rem,9vw,8rem)] leading-[0.95] tracking-tighter text-balance"
          >
            Stickers, <em className="font-light">softly</em>
            <br />
            reimagined.
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
            className="mt-8 max-w-md text-base leading-relaxed text-foreground/70"
          >
            Becute Dreams is a modern atelier crafting premium stickers and creative accessories.
            Designed in calm. Made with care. Made to be loved.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease, delay: 0.45 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/shop"
              className="group inline-flex h-14 items-center gap-3 rounded-full bg-foreground pl-7 pr-3 text-xs uppercase tracking-[0.25em] text-background transition hover:scale-[1.02]"
            >
              Shop now
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground transition group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
            <Link
              to="/collections"
              className="inline-flex h-14 items-center rounded-full border border-foreground/20 px-7 text-xs uppercase tracking-[0.25em] text-foreground/80 transition hover:border-foreground hover:text-foreground"
            >
              Explore collections
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 grid max-w-md grid-cols-3 gap-6 text-xs"
          >
            {[
              ["12k+", "Soft hearts"],
              ["320+", "Designs"],
              ["4.9★", "Adored"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-3xl">{n}</p>
                <p className="mt-1 uppercase tracking-[0.18em] text-muted-foreground">{l}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease }}
          className="lg:col-span-6"
        >
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] shadow-luxe">
              <img
                src={hero}
                alt="Premium curated stickers on a soft pink marble surface"
                width={1600}
                height={1200}
                className="aspect-[5/6] w-full object-cover"
              />
            </div>
            {/* Floating badge */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute -left-4 top-10 hidden rounded-2xl bg-background/80 p-4 shadow-soft backdrop-blur md:block float-soft"
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                New drop
              </p>
              <p className="font-display text-xl">Lavender Series</p>
            </motion.div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="absolute -right-4 bottom-10 hidden rounded-2xl bg-foreground p-4 text-background shadow-luxe md:block float-soft"
              style={{ animationDelay: "1.5s" }}
            >
              <p className="text-[10px] uppercase tracking-[0.25em] opacity-60">From</p>
              <p className="font-display text-2xl">Rs. 500</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="mt-20 overflow-hidden border-y border-foreground/10 py-5">
        <div className="marquee-track flex w-max items-center gap-16 whitespace-nowrap font-display text-3xl text-foreground/70">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            [
              "Hand-finished",
              "✦",
              "Small batches",
              "✦",
              "Soft shipping",
              "✦",
              "Made with care",
              "✦",
              "Designed in calm",
              "✦",
              "Limited editions",
              "✦",
            ].map((s, i) => (
              <span key={`${k}-${i}`} className="italic">
                {s}
              </span>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
