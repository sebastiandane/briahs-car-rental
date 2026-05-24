import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, X, Plus, Filter, Download } from "lucide-react";
import { Badge, Btn, Card, PageHeader, TInput, TSelect, Toolbar } from "@/components/admin/ui";
import { bookings, peso, type BookingStatus } from "@/data/admin";

export const Route = createFileRoute("/admin/bookings")({ component: BookingsPage });

const statuses: (BookingStatus | "All")[] = ["All", "Pending", "Confirmed", "Ongoing", "Completed", "Cancelled"];
const branches = ["All branches", "Taft, Manila", "Antipolo, Rizal"];

function BookingsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [branch, setBranch] = useState<(typeof branches)[number]>("All branches");

  const rows = useMemo(() => bookings.filter((b) => {
    if (status !== "All" && b.status !== status) return false;
    if (branch !== "All branches" && b.branch !== branch) return false;
    if (q && ![b.id, b.customer, b.vehicle, b.plate].join(" ").toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [q, status, branch]);

  return (
    <div>
      <PageHeader
        title="Bookings"
        subtitle="Approve, modify, and monitor every reservation across branches."
        actions={
          <>
            <Btn><Download className="h-4 w-4" /> Export</Btn>
            <Btn variant="primary"><Plus className="h-4 w-4" /> New booking</Btn>
          </>
        }
      />

      <Toolbar>
        <TInput placeholder="Search ID, customer, vehicle, plate…" value={q} onChange={(e) => setQ(e.target.value)} className="min-w-80" />
        <TSelect value={status} onChange={(e) => setStatus(e.target.value as never)}>
          {statuses.map((s) => <option key={s}>{s}</option>)}
        </TSelect>
        <TSelect value={branch} onChange={(e) => setBranch(e.target.value as never)}>
          {branches.map((b) => <option key={b}>{b}</option>)}
        </TSelect>
        <Btn variant="ghost"><Filter className="h-4 w-4" /> More filters</Btn>
        <span className="ml-auto text-xs text-muted-foreground">{rows.length} of {bookings.length} bookings</span>
      </Toolbar>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-card text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                <Th>ID</Th><Th>Customer</Th><Th>Vehicle</Th><Th>Branch</Th>
                <Th>Dates</Th><Th className="text-right">Amount</Th>
                <Th>Payment</Th><Th>Status</Th><Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id} className="border-b border-border/60 transition-colors hover:bg-secondary/40">
                  <Td className="font-mono text-xs text-muted-foreground">{b.id}</Td>
                  <Td className="font-medium">{b.customer}</Td>
                  <Td>
                    <div>{b.vehicle}</div>
                    <div className="text-[11px] text-muted-foreground">{b.plate}</div>
                  </Td>
                  <Td className="text-muted-foreground">{b.branch}</Td>
                  <Td className="text-muted-foreground">{b.from} → {b.to}</Td>
                  <Td className="text-right font-display font-semibold">{peso(b.amount)}</Td>
                  <Td><Badge>{b.payment}</Badge></Td>
                  <Td><Badge>{b.status}</Badge></Td>
                  <Td className="text-right">
                    {b.status === "Pending" ? (
                      <div className="flex justify-end gap-1.5">
                        <button className="inline-flex h-7 items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20">
                          <Check className="h-3.5 w-3.5" /> Approve
                        </button>
                        <button className="inline-flex h-7 items-center gap-1 rounded-md border border-rose-500/30 bg-rose-500/10 px-2 text-xs font-medium text-rose-400 hover:bg-rose-500/20">
                          <X className="h-3.5 w-3.5" /> Reject
                        </button>
                      </div>
                    ) : (
                      <button className="text-xs font-medium text-primary hover:underline">Manage</button>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 text-left font-semibold ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}
