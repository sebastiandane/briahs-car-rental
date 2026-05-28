import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, UserPlus, Search } from "lucide-react";
import { Badge, Btn, Card, CardHeader, PageHeader, TInput, Toolbar } from "@/components/admin/ui";
import { customers, peso } from "@/data/admin";
import { useState } from "react";

export const Route = createFileRoute("/admin/customers")({ component: CustomersPage });

function CustomersPage() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(customers[0]);

  const rows = customers.filter((c) =>
    !q || [c.id, c.name, c.email, c.phone].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Verify identities, monitor rental behavior, manage histories."
        actions={<Btn variant="primary"><UserPlus className="h-4 w-4" /> Add customer</Btn>}
      />

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div>
          <Toolbar>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <TInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, phone…" className="w-full pl-9" />
            </div>
            <span className="text-xs text-muted-foreground">{rows.length} customers</span>
          </Toolbar>

          <Card>
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold">Customer</th>
                  <th className="px-4 py-3 text-left font-semibold">Joined</th>
                  <th className="px-4 py-3 text-right font-semibold">Trips</th>
                  <th className="px-4 py-3 text-right font-semibold">Lifetime spend</th>
                  <th className="px-4 py-3 text-left font-semibold">Verification</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id} onClick={() => setSelected(c)}
                      className={`cursor-pointer border-b border-border/60 transition-colors hover:bg-secondary/40 ${selected.id === c.id ? "bg-primary/5" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">{c.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</span>
                        <div>
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{c.joined}</td>
                    <td className="px-4 py-3 text-right">{c.trips}</td>
                    <td className="px-4 py-3 text-right font-display font-semibold">{peso(c.spent)}</td>
                    <td className="px-4 py-3"><Badge>{c.verification}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <Card className="self-start">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/15 font-display text-lg font-semibold text-primary">
                {selected.name.split(" ").map(n=>n[0]).slice(0,2).join("")}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold">{selected.name}</h3>
                <div className="mt-1"><Badge>{selected.verification}</Badge></div>
              </div>
            </div>

            <dl className="mt-5 space-y-2.5 text-sm">
              <Row icon={<Mail className="h-4 w-4 text-primary" />} label="Email" value={selected.email} />
              <Row icon={<Phone className="h-4 w-4 text-primary" />} label="Phone" value={selected.phone} />
              <Row label="Customer ID" value={selected.id} />
              <Row label="Joined" value={selected.joined} />
              <Row label="Total trips" value={String(selected.trips)} />
              <Row label="Lifetime spend" value={peso(selected.spent)} />
            </dl>

            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-5">
              <KPIish label="Ongoing" value="1" />
              <KPIish label="Completed" value={String(selected.trips - 1)} />
              <KPIish label="Cancelled" value="0" />
            </div>
          </div>

          <CardHeader title="Uploaded requirements" />
          <ul className="divide-y divide-border text-sm">
            {[
              { f: "drivers_license.jpg", state: "Verified" as const },
              { f: "valid_id_back.jpg", state: "Verified" as const },
              { f: "secondary_id_front.jpg", state: selected.verification },
              { f: "secondary_id_back.jpg", state: selected.verification },
            ].map((d) => (
              <li key={d.f} className="flex items-center justify-between px-5 py-3">
                <span className="font-mono text-xs">{d.f}</span>
                <Badge>{d.state}</Badge>
              </li>
            ))}
          </ul>

          <div className="flex gap-2 border-t border-border p-4">
            <Btn variant="primary" className="flex-1">Approve</Btn>
            <Btn variant="danger" className="flex-1">Reject</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">{icon}{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
function KPIish({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-secondary/60 p-3 text-center">
      <div className="font-display text-lg font-semibold text-primary">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
