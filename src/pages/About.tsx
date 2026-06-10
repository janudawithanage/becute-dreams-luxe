import { motion } from "framer-motion";
import about from "@/assets/about.jpg";

export function About() {
  return (
    <div>
      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12 lg:py-32">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">The atelier</p>
        <h1 className="mt-5 max-w-4xl font-display text-6xl leading-[1] tracking-tight lg:text-9xl">
          Made <em className="font-light">slowly,</em>
          <br />
          loved <em className="font-light">softly.</em>
        </h1>
      </section>

      <section className="relative">
        <motion.img
          src={about}
          alt="Inside the atelier"
          loading="lazy"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="h-[60vh] w-full object-cover lg:h-[80vh]"
        />
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 lg:py-32">
        <p className="font-display text-3xl leading-relaxed text-foreground/80 lg:text-4xl">
          Becute Dreams began in a sunlit corner of a quiet apartment, where a stack of sketches
          became a small ritual. We design and produce premium stickers and creative accessories for
          those who collect small, beautiful things.
        </p>
        <p className="mt-8 text-base leading-relaxed text-foreground/70">
          Every series is sketched by hand, printed in small runs on premium soft-touch and matte
          vinyl, and finished by our team. Nothing is rushed. Nothing is mass-produced. Every order
          is packed with tissue, a note, and the same care we'd want for ourselves.
        </p>

        <div className="mt-16 grid grid-cols-2 gap-10 border-t pt-12 md:grid-cols-4">
          {[
            ["06", "Years"],
            ["100%", "Small batch"],
            ["320+", "Designs"],
            ["12k", "Soft hearts"],
          ].map(([n, l]) => (
            <div key={l}>
              <p className="font-display text-5xl">{n}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
