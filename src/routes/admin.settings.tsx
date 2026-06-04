import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const user = useAuth((s) => s.user);
  const [storeName, setStoreName] = useState("Becute Dreams");
  const [tagline, setTagline] = useState("Stickers, softly reimagined.");
  const [supportEmail, setSupportEmail] = useState("hello@becutedreams.com");
  const [notifyOrders, setNotifyOrders] = useState(true);
  const [notifyMarketing, setNotifyMarketing] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings saved");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Atelier</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight lg:text-5xl">Settings</h1>
      </div>

      {/* Account card */}
      <Section title="Account" description="The administrator currently signed in.">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-muted/30 p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-sm font-medium text-background">
            {(user?.email?.[0] ?? "A").toUpperCase()}
          </span>
          <div>
            <p className="text-sm font-medium">{user?.email}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Administrator
            </p>
          </div>
        </div>
      </Section>

      <form onSubmit={handleSave} className="space-y-10">
        <Section title="Storefront" description="How the boutique appears to customers.">
          <Field label="Store name">
            <input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Tagline">
            <input value={tagline} onChange={(e) => setTagline(e.target.value)} className="input" />
          </Field>
          <Field label="Support email">
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="input"
            />
          </Field>
        </Section>

        <Section title="Notifications" description="Decide what reaches your inbox.">
          <Toggle
            label="New order notifications"
            description="Receive an email each time an order is placed."
            checked={notifyOrders}
            onChange={setNotifyOrders}
          />
          <Toggle
            label="Marketing summaries"
            description="A weekly digest of campaign performance."
            checked={notifyMarketing}
            onChange={setNotifyMarketing}
          />
        </Section>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="inline-flex h-11 items-center rounded-full border border-border bg-card px-5 text-xs uppercase tracking-[0.2em] text-foreground/80 transition hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex h-11 items-center rounded-full bg-foreground px-6 text-xs uppercase tracking-[0.2em] text-background transition hover:opacity-80"
          >
            Save changes
          </button>
        </div>
      </form>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid hsl(var(--input) / 1, var(--input));
          background-color: var(--background);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .input:focus {
          border-color: var(--ring);
          box-shadow: 0 0 0 3px hsl(var(--ring) / 0.15);
        }
      `}</style>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-6">
        <h2 className="font-display text-xl">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
          checked ? "bg-foreground" : "bg-muted"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-background transition ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
