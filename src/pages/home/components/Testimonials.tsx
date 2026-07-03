import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const quotes = [
  {
    q: "It feels like opening a small piece of someone's diary. Absolutely in love.",
    a: "Mia",
    location: "Paris",
    rating: 5,
  },
  {
    q: "The quality is honestly unreal. Everything is so softly luxurious.",
    a: "Hana",
    location: "Tokyo",
    rating: 5,
  },
  {
    q: "I gift Becute packs to all my best friends. It's our love language now.",
    a: "Sara",
    location: "Cairo",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="bg-gradient-blush py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="text-center text-xs uppercase tracking-[0.35em] text-muted-foreground"
        >
          Quietly loved
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease, delay: 0.08 }}
          className="mx-auto mt-4 max-w-3xl text-center font-display text-5xl tracking-tight lg:text-7xl"
        >
          Words from the <em className="font-light">becute family.</em>
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {quotes.map((t, i) => (
            <motion.figure
              key={i}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease, delay: i * 0.12 }}
              whileHover={{ y: -4 }}
              className="glass rounded-3xl p-8 transition-shadow duration-500 hover:shadow-luxe"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <span key={si} className="text-gold text-sm">★</span>
                ))}
              </div>

              <span className="mt-4 block font-display text-6xl leading-none text-foreground/20">
                "
              </span>
              <blockquote className="-mt-4 font-display text-2xl leading-snug text-balance">
                {t.q}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3">
                {/* Avatar placeholder */}
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center text-background text-xs font-medium"
                  style={{ background: "var(--gradient-ink)" }}
                >
                  {t.a[0]}
                </div>
                <div>
                  <p className="text-xs font-medium">{t.a}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {t.location}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
