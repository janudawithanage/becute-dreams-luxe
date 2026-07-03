import { motion } from "framer-motion";
import { Instagram, Mail, MessageCircle, ArrowUpRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const channels = [
  {
    Icon: MessageCircle,
    label: "WhatsApp",
    value: "+00 000 000 000",
    href: "https://wa.me/0",
    description: "Quickest response, usually within an hour.",
  },
  {
    Icon: Mail,
    label: "Email",
    value: "hello@becutedreams.com",
    href: "mailto:hello@becutedreams.com",
    description: "For custom orders and collabs. We reply within 24 h.",
  },
  {
    Icon: Instagram,
    label: "Instagram",
    value: "@becute_dreams",
    href: "https://www.instagram.com/becute_dreams?igsh=cHExODhycW5obXo3",
    description: "DMs welcome. Share where your stickers live now.",
  },
];

export function Contact() {
  return (
    <div className="page-enter">
      {/* Hero */}
      <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12 lg:py-32">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="text-xs uppercase tracking-[0.35em] text-muted-foreground"
        >
          Get in touch
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.1 }}
          className="mt-4 font-display text-[clamp(3.5rem,9vw,8rem)] leading-[0.95] tracking-tighter"
        >
          Say <em className="font-light">hello.</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.25 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-foreground/70"
        >
          For custom orders, collaborations, or to share where your stickers are living now — we
          love hearing from you.
        </motion.p>

        {/* Channel cards */}
        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
          {channels.map(({ Icon, label, value, href, description }, i) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.15 + i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-3xl border bg-background p-8 transition-shadow duration-500 hover:shadow-luxe"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{ background: "linear-gradient(135deg, color-mix(in oklab, var(--blush) 8%, transparent), transparent)" }}
              />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted transition-transform duration-500 group-hover:scale-110">
                    <Icon className="h-5 w-5 text-foreground/70" />
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/10 text-foreground/30 transition-all duration-500 group-hover:rotate-45 group-hover:border-foreground/40 group-hover:text-foreground">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-8 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  {label}
                </p>
                <p className="mt-1 font-display text-2xl">{value}</p>
                <p className="mt-3 text-sm leading-relaxed text-foreground/60">{description}</p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* FAQ strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="mt-24 rounded-3xl p-10 lg:p-14"
          style={{ background: "color-mix(in oklab, var(--lavender) 15%, var(--background))" }}
        >
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
            Before you write
          </p>
          <h2 className="mt-4 font-display text-4xl tracking-tight lg:text-5xl">
            Quick <em className="font-light">answers.</em>
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["Do you ship worldwide?", "Yes — every order ships in soft packaging with a note."],
              ["How long does delivery take?", "Standard 5–7 days, express 2–3 business days."],
              ["Can I do a custom order?", "Absolutely. DM us on Instagram or send an email."],
            ].map(([q, a]) => (
              <div key={q} className="border-t pt-6">
                <p className="font-display text-lg leading-snug">{q}</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">{a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
