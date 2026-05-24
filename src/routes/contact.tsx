import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - Briah's Car Rental" },
      {
        name: "description",
        content:
          "Get in touch with Briah's Car Rental. Branches in Taft, Manila and Antipolo, Rizal.",
      },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const cards = [
  { icon: Phone, label: "Call us", value: "+63 917 555 0142", href: "tel:+639175550142" },
  {
    icon: Mail,
    label: "Email",
    value: "hello@briahsrental.ph",
    href: "mailto:hello@briahsrental.ph",
  },
  { icon: MapPin, label: "Visit us", value: "Taft, Manila / Antipolo, Rizal" },
  { icon: Clock, label: "Office hours", value: "Mon-Sun / 7:00 AM - 9:00 PM" },
];

const branches = [
  {
    name: "Taft, Manila",
    address: "2/F Briah Building, Taft Avenue, Manila 1004",
    note: "Main pickup hub for Metro Manila rentals.",
  },
  {
    name: "Antipolo, Rizal",
    address: "Sumulong Highway, Antipolo, Rizal 1870",
    note: "Convenient for Rizal and eastern Luzon trips.",
  },
];

function ContactPage() {
  return (
    <div>
      <Header />

      <section className="border-b border-border bg-surface">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Contact
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
              Talk to Briah's
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
              Questions about availability, branch pickup, or long-distance Luzon trips? Send a note
              and our team will get back to you within a few hours.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {cards.map((card) => (
              <ContactCard key={card.label} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            toast.success("Message sent - we'll reply within a few hours.");
          }}
          className="rounded-xl border border-border bg-card p-6 shadow-soft md:p-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold">Send us a message</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Share the dates, vehicle type, and pickup branch you have in mind.
              </p>
            </div>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Same-day replies
            </span>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <Field label="Full name">
              <input className="input" required />
            </Field>
            <Field label="Email">
              <input type="email" className="input" required />
            </Field>
          </div>

          <Field label="Subject" className="mt-5">
            <input
              className="input"
              placeholder="Booking question, branch pickup, or pricing"
              required
            />
          </Field>

          <Field label="Message" className="mt-5">
            <textarea
              rows={6}
              className="input !h-auto py-3"
              placeholder="How can we help?"
              required
            />
          </Field>

          <button className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Send message
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <h2 className="font-display text-lg font-semibold">Branches</h2>
            <div className="mt-4 space-y-4">
              {branches.map((branch) => (
                <div
                  key={branch.name}
                  className="border-t border-border pt-4 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold">{branch.name}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {branch.address}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{branch.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-secondary p-5">
            <h2 className="font-display text-lg font-semibold">Service area</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              We deliver and serve anywhere in Luzon, from Baguio and Vigan in the north to Bicol in
              the south.
            </p>
          </div>
        </aside>
      </section>

      <Footer />

      <style>{`
        .input {
          width: 100%;
          height: 2.75rem;
          border-radius: 0.5rem;
          border: 1px solid var(--color-border);
          background: var(--color-background);
          padding: 0 0.875rem;
          font-size: 0.875rem;
          color: var(--color-foreground);
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .input::placeholder { color: var(--color-muted-foreground); }
        .input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 18%, transparent);
        }
      `}</style>
    </div>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-foreground">{label}</span>
        <span className="mt-1 block text-sm leading-5 text-muted-foreground">{value}</span>
      </span>
    </>
  );

  const className =
    "flex min-h-24 items-center gap-3 rounded-xl border border-border bg-card p-4 text-left shadow-soft transition-colors hover:border-primary/35";

  if (href) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
