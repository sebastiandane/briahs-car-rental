import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, LayoutGrid, List, Wrench } from "lucide-react";
import { Badge, Btn, Card, PageHeader, TInput, TSelect, Toolbar } from "@/components/admin/ui";
import { fleet, peso, type VehicleStatus } from "@/data/admin";

export const Route = createFileRoute("/admin/fleet")({ component: FleetPage });

const statuses: (VehicleStatus | "All")[] = ["All", "Available", "Reserved", "Rented", "Maintenance", "Inactive"];

function FleetPage() {
  const [view, setView] = useState<"grid" | "table">("grid");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [q, setQ] = useState("");

  const rows = fleet.filter((v) => {
    if (status !== "All" && v.status !== status) return false;
    if (q && ![v.name, v.plate, v.category].join(" ").toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Fleet management"
        subtitle="56 total vehicles across two branches — track condition, assignment, and pricing."
        actions={<Btn variant="primary"><Plus className="h-4 w-4" /> Add vehicle</Btn>}
      />

      <Toolbar>
        <TInput placeholder="Search vehicle or plate…" value={q} onChange={(e) => setQ(e.target.value)} className="min-w-72" />
        <TSelect value={status} onChange={(e) => setStatus(e.target.value as never)}>
          {statuses.map((s) => <option key={s}>{s}</option>)}
        </TSelect>
        <div className="ml-auto flex items-center gap-1 rounded-md border border-border bg-background p-0.5">
          <button onClick={() => setView("grid")} className={`grid h-7 w-7 place-items-center rounded ${view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}><LayoutGrid className="h-3.5 w-3.5" /></button>
          <button onClick={() => setView("table")} className={`grid h-7 w-7 place-items-center rounded ${view === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}><List className="h-3.5 w-3.5" /></button>
        </div>
      </Toolbar>

      {view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {rows.map((v) => (
            <Card key={v.id} className="overflow-hidden">
              <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-secondary to-background">
                <div className="text-center">
                  <div className="font-display text-3xl font-bold text-primary/70">{v.category[0]}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{v.category}</div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-base font-semibold">{v.name}</h3>
                    <div className="font-mono text-xs text-muted-foreground">{v.plate}</div>
                  </div>
                  <Badge>{v.status}</Badge>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-y-1.5 text-xs">
                  <dt className="text-muted-foreground">Branch</dt><dd className="text-right">{v.branch.split(",")[0]}</dd>
                  <dt className="text-muted-foreground">Transmission</dt><dd className="text-right">{v.transmission}</dd>
                  <dt className="text-muted-foreground">Seats</dt><dd className="text-right">{v.seats}</dd>
                  <dt className="text-muted-foreground">Condition</dt><dd className="text-right">{v.condition}</dd>
                </dl>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <div>
                    <div className="font-display text-lg font-semibold text-primary">{peso(v.pricePerDay)}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">per day</div>
                  </div>
                  <button className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-background px-2.5 text-xs hover:bg-secondary">
                    <Wrench className="h-3.5 w-3.5" /> Service
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-semibold">Vehicle</th>
                <th className="px-4 py-3 text-left font-semibold">Plate</th>
                <th className="px-4 py-3 text-left font-semibold">Branch</th>
                <th className="px-4 py-3 text-left font-semibold">Condition</th>
                <th className="px-4 py-3 text-right font-semibold">Rate / day</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((v) => (
                <tr key={v.id} className="border-b border-border/60 hover:bg-secondary/40">
                  <td className="px-4 py-3"><div className="font-medium">{v.name}</div><div className="text-xs text-muted-foreground">{v.category} • {v.transmission} • {v.seats} seats</div></td>
                  <td className="px-4 py-3 font-mono text-xs">{v.plate}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.branch}</td>
                  <td className="px-4 py-3">{v.condition}</td>
                  <td className="px-4 py-3 text-right font-display font-semibold">{peso(v.pricePerDay)}</td>
                  <td className="px-4 py-3"><Badge>{v.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
