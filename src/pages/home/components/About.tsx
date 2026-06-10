import { motion } from "framer-motion";
import about from "@/assets/about.jpg";

export function About() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12 lg:py-32">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-[2rem] lg:col-span-7"
        >
          <img
            src={about}
            alt="Inside the Becute Dreams atelier"
            loading="lazy"
            className="aspect-[5/6] w-full object-cover"
          />
        </motion.div>

        <div className="lg:col-span-5">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">The atelier</p>
          <h2 className="mt-5 font-display text-5xl leading-[1.02] tracking-tight lg:text-6xl">
            A quiet studio for the <em className="font-light">softly creative.</em>
          </h2>
          <p className="mt-8 text-base leading-relaxed text-foreground/70">
            Every Becute design begins as a small sketch on paper. Our pieces are printed in limited
            runs on premium matte and soft-touch vinyls, hand-trimmed, and pressed into tissue with
            a written note.
          </p>
          <p className="mt-4 text-base leading-relaxed text-foreground/70">
            We believe the small objects you choose deserve the same intention as a fine perfume or
            a beloved book. Designed in calm. Made with care. Made to be lived with.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6 border-t pt-8">
            <div>
              <p className="font-display text-4xl">06</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Years of soft work
              </p>
            </div>
            <div>
              <p className="font-display text-4xl">100%</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Small-batch made
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
