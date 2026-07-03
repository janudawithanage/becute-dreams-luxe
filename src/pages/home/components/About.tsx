import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import about from "@/assets/about.jpg";

const ease = [0.22, 1, 0.36, 1] as const;

export function About() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12 lg:py-32">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
        {/* Image */}
        <motion.div
          initial={{ scale: 1.04, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.3, ease }}
          className="overflow-hidden rounded-[2rem] shadow-luxe lg:col-span-7"
        >
          <img
            src={about}
            alt="Inside the Becute Dreams atelier"
            loading="lazy"
            className="aspect-[5/6] w-full object-cover transition duration-[1500ms] hover:scale-[1.03]"
          />
        </motion.div>

        {/* Copy */}
        <div className="lg:col-span-5">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease }}
            className="text-xs uppercase tracking-[0.35em] text-muted-foreground"
          >
            The atelier
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease, delay: 0.08 }}
            className="mt-5 font-display text-5xl leading-[1.02] tracking-tight lg:text-6xl"
          >
            A quiet studio for the{" "}
            <em className="font-light">softly creative.</em>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease, delay: 0.15 }}
          >
            <p className="mt-8 text-base leading-relaxed text-foreground/70">
              Every Becute design begins as a small sketch on paper. Our pieces are printed in
              limited runs on premium matte and soft-touch vinyls, hand-trimmed, and pressed into
              tissue with a written note.
            </p>
            <p className="mt-4 text-base leading-relaxed text-foreground/70">
              We believe the small objects you choose deserve the same intention as a fine perfume
              or a beloved book. Designed in calm. Made with care. Made to be lived with.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="mt-10 grid grid-cols-2 gap-6 border-t pt-8"
          >
            {[
              ["06", "Years of soft work"],
              ["100%", "Small-batch made"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-4xl">{n}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{l}</p>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease, delay: 0.28 }}
            className="mt-8"
          >
            <Link
              to="/about"
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-foreground/70 transition hover:text-foreground"
            >
              Our story
              <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:rotate-45" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
