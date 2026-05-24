import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calendar, Car, MapPin, ShieldCheck } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { peso, vehicles } from "@/data/vehicles";
import { toast } from "sonner";

type Search = { vehicle?: string };

export const Route = createFileRoute("/booking")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    vehicle: typeof s.vehicle === "string" ? s.vehicle : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Book a car — Briah's Car Rental" },
      { name: "description", content: "Reserve your car in minutes. Self-drive or with a driver, pickup in Taft or Antipolo." },
    ],
    links: [{ rel: "canonical", href: "/booking" }],
  }),
  component: BookingPage,
});

function BookingPage() {
  const { vehicle } = Route.useSearch();
  const initial = vehicles.find((v) => v.id === vehicle) ?? vehicles[0];

  const [vehicleId, setVehicleId] = useState(initial.id);
  const [branch, setBranch] = useState(initial.branch);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const selected = vehicles.find((v) => v.id === vehicleId) ?? initial;

  const days = useMemo(() => {
    if (!pickup || !dropoff) return 1;
    const ms = new Date(dropoff).getTime() - new Date(pickup).getTime();
    return Math.max(1, Math.ceil(ms / 86400000));
  }, [pickup, dropoff]);
  const total = selected.pricePerDay * days;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Booking received!", {
      description: `${selected.name} • ${days} day${days > 1 ? "s" : ""} • ${peso(total)} — we'll confirm by email shortly.`,
    });
  }

  return (
    <div>
      <Header />

      <section className="border-b border-border bg-secondary/60">
        <div className="container-page py-14 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Reserve your car</p>
          <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">Booking</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Tell us where you're going. We'll confirm availability within a few hours.
          </p>
        </div>
      </section>

      <section className="container-page mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-8 shadow-soft">
          <h2 className="font-display text-2xl font-semibold">Trip details</h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Field label="Vehicle">
              <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className="input">
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>{v.name} — {peso(v.pricePerDay)}/day</option>
                ))}
              </select>
            </Field>
            <Field label="Drive mode">
              <input className="input" value="Self-drive" disabled />
            </Field>
            <Field label="Pickup branch">
              <select value={branch} onChange={(e) => setBranch(e.target.value as never)} className="input">
                <option>Taft, Manila</option>
                <option>Antipolo, Rizal</option>
              </select>
            </Field>
            <Field label="Return branch">
              <select className="input" defaultValue={branch}>
                <option>Same as pickup</option>
                <option>Taft, Manila</option>
                <option>Antipolo, Rizal</option>
              </select>
            </Field>
            <Field label="Pickup date &amp; time">
              <input type="datetime-local" value={pickup} onChange={(e) => setPickup(e.target.value)} className="input" required />
            </Field>
            <Field label="Return date &amp; time">
              <input type="datetime-local" value={dropoff} onChange={(e) => setDropoff(e.target.value)} className="input" required />
            </Field>
          </div>

          <h2 className="mt-10 font-display text-2xl font-semibold">Your details</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Field label="Full name">
              <input value={name} onChange={(e) => setName(e.target.value)} className="input" required />
            </Field>
            <Field label="Email">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required />
            </Field>
            <Field label="Phone (PH)">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input" placeholder="+63 917 000 0000" required />
            </Field>
            <Field label="Destination (optional)">
              <input className="input" placeholder="e.g. Baguio, La Union" />
            </Field>
          </div>

          <button type="submit" className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Request booking
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            You won't be charged yet — we'll confirm availability first.
          </p>
        </form>

        <aside className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <img src={selected.image} alt={selected.name} className="aspect-[4/3] w-full object-cover" />
            <div className="p-6">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{selected.category}</div>
              <h3 className="font-display text-xl font-semibold">{selected.name}</h3>
              <div className="mt-3 space-y-2 text-sm">
                <Row icon={<Car className="h-4 w-4 text-primary" />} label="Mode" value="Self-drive" />
                <Row icon={<MapPin className="h-4 w-4 text-primary" />} label="Branch" value={branch} />
                <Row icon={<Calendar className="h-4 w-4 text-primary" />} label="Duration" value={`${days} day${days > 1 ? "s" : ""}`} />
              </div>
              <div className="mt-5 space-y-1.5 border-t border-border pt-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>{selected.name} × {days}</span>
                  <span>{peso(selected.pricePerDay * days)}</span>
                </div>
                <div className="flex justify-between pt-2 font-display text-lg font-semibold">
                  <span>Total estimate</span>
                  <span className="text-primary">{peso(total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-secondary p-5 text-sm">
            <div className="flex items-center gap-2 font-medium"><ShieldCheck className="h-4 w-4 text-primary" /> What's included</div>
            <ul className="mt-3 space-y-1.5 text-muted-foreground">
              <li>• Comprehensive insurance</li>
              <li>• 24/7 roadside assistance</li>
              <li>• Free cancellation up to 24h before pickup</li>
            </ul>
          </div>
        </aside>
      </section>

      <Footer />

      <style>{`
        .input {
          width: 100%;
          height: 2.75rem;
          border-radius: 0.6rem;
          border: 1px solid var(--color-border);
          background: var(--color-card);
          padding: 0 0.875rem;
          font-size: 0.875rem;
          color: var(--color-foreground);
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 18%, transparent); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground" dangerouslySetInnerHTML={{ __html: label }} />
      {children}
    </label>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-muted-foreground">{icon}{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
