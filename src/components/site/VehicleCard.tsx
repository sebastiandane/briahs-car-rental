import { Link } from "@tanstack/react-router";
import { Fuel, MapPin, Settings2, Users } from "lucide-react";
import { peso, type Vehicle } from "@/data/vehicles";

export function VehicleCard({ v }: { v: Vehicle }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={v.image}
          alt={v.name}
          loading="lazy"
          width={1024}
          height={768}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur border border-border">
            {v.category}
          </span>
          {!v.available && (
            <span className="rounded-full bg-destructive/95 px-2.5 py-1 text-[11px] font-medium text-destructive-foreground shadow-sm">
              Booked
            </span>
          )}
        </div>
        <div className="absolute right-3 top-3">
          <span className="rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground backdrop-blur">
            Self-drive
          </span>
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold leading-tight">{v.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> {v.branch}
            </p>
          </div>
          <div className="text-right">
            <div className="font-display text-xl font-semibold text-primary">{peso(v.pricePerDay)}</div>
            <div className="text-[11px] text-muted-foreground">per day</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Settings2 className="h-3.5 w-3.5" />{v.transmission}</span>
          <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{v.seats} seats</span>
          <span className="flex items-center gap-1.5"><Fuel className="h-3.5 w-3.5" />{v.fuel}</span>
        </div>

        <Link
          to="/booking"
          search={{ vehicle: v.id }}
          className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {v.available ? "Reserve" : "Join waitlist"}
        </Link>
      </div>
    </article>
  );
}
