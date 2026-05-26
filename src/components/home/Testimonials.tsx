import { motion } from "framer-motion";

const quotes = [
  { q: "It feels like opening a small piece of someone's diary. Absolutely in love.", a: "Mia · Paris" },
  { q: "The quality is honestly unreal. Everything is so softly luxurious.", a: "Hana · Tokyo" },
  { q: "I gift Becute packs to all my best friends. It's our love language now.", a: "Sara · Cairo" },
];

export function Testimonials() {
  return (
    <section className="bg-gradient-blush py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <p className="text-center text-xs uppercase tracking-[0.35em] text-muted-foreground">
          Quietly loved
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl text-center font-display text-5xl tracking-tight lg:text-7xl">
          Words from the <em className="font-light">becute family.</em>
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {quotes.map((t, i) => (
            <motion.figure
              key={i}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="glass rounded-3xl p-8"
            >
              <span className="font-display text-6xl leading-none text-foreground/30">"</span>
              <blockquote className="-mt-4 font-display text-2xl leading-snug text-balance">
                {t.q}
              </blockquote>
              <figcaption className="mt-8 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                — {t.a}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
