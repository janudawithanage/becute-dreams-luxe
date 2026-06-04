import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Mail, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: Contact,
});

function Contact() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12 lg:py-32">
      <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Get in touch</p>
      <h1 className="mt-4 font-display text-6xl tracking-tight lg:text-8xl">
        Say <em className="font-light">hello.</em>
      </h1>
      <p className="mt-6 max-w-xl text-foreground/70">
        For custom orders, collaborations, or to share where your stickers are living now — we love
        hearing from you.
      </p>

      <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          {
            Icon: MessageCircle,
            label: "WhatsApp",
            value: "+00 000 000 000",
            href: "https://wa.me/0",
          },
          {
            Icon: Mail,
            label: "Email",
            value: "hello@becutedreams.com",
            href: "mailto:hello@becutedreams.com",
          },
          {
            Icon: Instagram,
            label: "Instagram",
            value: "@becute.dreams",
            href: "https://instagram.com",
          },
        ].map(({ Icon, label, value, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="group rounded-3xl border bg-background p-8 transition hover:bg-muted"
          >
            <Icon className="h-6 w-6 text-foreground/70 transition group-hover:scale-110" />
            <p className="mt-8 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-1 font-display text-2xl">{value}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
