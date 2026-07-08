import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import about from "@/assets/about.jpg";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const ease = [0.22, 1, 0.36, 1] as const;

const stats = [
  ["06", "Years of soft work"],
  ["100%", "Small-batch made"],
  ["320+", "Unique designs"],
  ["500+", "Soft hearts"],
];

const values = [
  {
    num: "01",
    title: "Designed in calm",
    body: "Every series starts as a small sketch, drawn in quiet hours. We never rush a design into production.",
  },
  {
    num: "02",
    title: "Made in small batches",
    body: "Limited runs on premium soft-touch and matte vinyl. When it's gone, it rests — until the next season.",
  },
  {
    num: "03",
    title: "Packed with care",
    body: "Every order is wrapped in tissue, sealed with a sticker, and includes a handwritten note from our team.",
  },
];

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12 lg:py-32">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="text-xs uppercase tracking-[0.35em] text-muted-foreground"
        >
          The atelier
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.1 }}
          className="mt-5 max-w-4xl font-display text-[clamp(3.5rem,9vw,8rem)] leading-[0.95] tracking-tighter"
        >
          Made <em className="font-light">slowly,</em>
          <br />
          loved <em className="font-light">softly.</em>
        </motion.h1>
      </section>

      {/* Parallax hero image */}
      <section ref={containerRef} className="relative overflow-hidden">
        <motion.div style={{ y: imageY, scale: imageScale }} className="will-change-transform">
          <img
            src={about}
            alt="Inside the atelier"
            loading="lazy"
            className="h-[60vh] w-full object-cover lg:h-[80vh]"
          />
        </motion.div>
        {/* Overlay caption */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
          className="absolute bottom-8 left-6 lg:left-12"
        >
          <p className="glass rounded-2xl px-5 py-3 text-xs uppercase tracking-[0.25em]">
            Becute Dreams · Sri Lanka
          </p>
        </motion.div>
      </section>

      {/* Body copy */}
      <section className="mx-auto max-w-3xl px-6 py-24 lg:py-32">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease }}
          className="font-display text-3xl leading-relaxed text-foreground/80 lg:text-4xl"
        >
          Becute Dreams began in a sunlit corner of a quiet apartment, where a stack of sketches
          became a small ritual. We design and produce premium stickers and creative accessories for
          those who collect small, beautiful things.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease, delay: 0.1 }}
          className="mt-8 text-base leading-relaxed text-foreground/70"
        >
          Every series is sketched by hand, printed in small runs on premium soft-touch and matte
          vinyl, and finished by our team. Nothing is rushed. Nothing is mass-produced. Every order
          is packed with tissue, a note, and the same care we'd want for ourselves.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease, delay: 0.15 }}
          className="mt-16 grid grid-cols-2 gap-10 border-t pt-12 md:grid-cols-4"
        >
          {stats.map(([n, l], i) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease, delay: 0.05 * i }}
            >
              <p className="font-display text-5xl">{n}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{l}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Values section */}
      <section
        className="py-24 lg:py-32"
        style={{ background: "color-mix(in oklab, var(--cream) 50%, transparent)" }}
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease }}
          >
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
              How we work
            </p>
            <h2 className="mt-4 font-display text-5xl tracking-tight lg:text-7xl">
              Our <em className="font-light">principles.</em>
            </h2>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {values.map((v, i) => (
              <motion.div
                key={v.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease, delay: i * 0.1 }}
                className="group rounded-3xl border bg-background p-8 transition-shadow duration-500 hover:shadow-luxe"
              >
                <p className="font-display text-5xl text-foreground/15">{v.num}</p>
                <h3 className="mt-6 font-display text-2xl">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between"
        >
          <h2 className="max-w-xl font-display text-5xl tracking-tight lg:text-6xl">
            Ready to find your <em className="font-light">aesthetic?</em>
          </h2>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-3 rounded-full bg-foreground pl-7 pr-3 py-3 text-xs uppercase tracking-[0.25em] text-background transition hover:scale-[1.02]"
          >
            Shop now
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-foreground transition group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
