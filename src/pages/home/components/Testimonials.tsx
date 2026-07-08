import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { reviewsService, type Review } from "@/features/reviews";

const ease = [0.22, 1, 0.36, 1] as const;

function ReviewCard({
  q,
  a,
  location,
  rating,
  index,
}: {
  q: string;
  a: string;
  location: string | null;
  rating: number;
  index: number;
}) {
  return (
    <motion.figure
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease, delay: index * 0.12 }}
      whileHover={{ y: -4 }}
      className="glass rounded-3xl p-8 transition-shadow duration-500 hover:shadow-luxe"
    >
      <div className="flex gap-1">
        {Array.from({ length: rating }).map((_, si) => (
          <span key={si} className="text-gold text-sm">★</span>
        ))}
      </div>

      <span className="mt-4 block font-display text-6xl leading-none text-foreground/20">"</span>
      <blockquote className="-mt-4 font-display text-2xl leading-snug text-balance">{q}</blockquote>

      <figcaption className="mt-8 flex items-center gap-3">
        <div
          className="h-8 w-8 rounded-full flex items-center justify-center text-background text-xs font-medium shrink-0"
          style={{ background: "var(--gradient-ink)" }}
        >
          {a[0]}
        </div>
        <div>
          <p className="text-xs font-medium">{a}</p>
          {location && (
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{location}</p>
          )}
        </div>
      </figcaption>
    </motion.figure>
  );
}

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    reviewsService
      .getDisplayReviews()
      .then(setReviews)
      .catch(() => setReviews([]));
  }, []);

  // Still loading — render nothing to avoid layout shift
  if (reviews === null) return null;

  // Admin hasn't marked any reviews for display yet — hide the section entirely
  if (reviews.length === 0) return null;

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
          {reviews.map((r, i) => (
            <ReviewCard
              key={r.id}
              q={r.body}
              a={r.customer_name}
              location={r.customer_location}
              rating={r.rating}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
