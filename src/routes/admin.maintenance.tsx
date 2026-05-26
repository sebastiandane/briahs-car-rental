import { createFileRoute } from "@tanstack/react-router";
import { Plus, Wrench, AlertTriangle, CalendarCheck, Activity } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useState } from "react";
import {
  MaintenanceRecordDialog,
  type MaintenanceRecordDraft,
  type MaintenanceStatus,
} from "@/components/admin/MaintenanceRecordDialog";
import { Badge, Btn, Card, CardHeader, KPI, PageHeader } from "@/components/admin/ui";
import { maintenance, peso } from "@/data/admin";

export const Route = createFileRoute("/admin/maintenance")({ component: MaintenancePage });

const downtime = [
  { m: "Jan", days: 18 },
  { m: "Feb", days: 14 },
  { m: "Mar", days: 22 },
  { m: "Apr", days: 12 },
  { m: "May", days: 9 },
  { m: "Jun", days: 16 },
];

function MaintenancePage() {
  const overdue = maintenance.filter((m) => m.status === "Overdue").length;
  const scheduled = maintenance.filter((m) => m.status === "Scheduled").length;
  const inProgress = maintenance.filter((m) => m.status === "In Progress").length;
  const totalCost = maintenance.reduce((s, m) => s + m.cost, 0);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [draft, setDraft] = useState<MaintenanceRecordDraft>(() => createDraftFromSource());

  function openServiceModal(index?: number) {
    setDraft(createDraftFromSource(index));
    setServiceModalOpen(true);
  }

  function createDraftFromSource(index = 0): MaintenanceRecordDraft {
    const source = maintenance[index] ?? maintenance[0];
    const numericId = Number(source?.id?.replace(/\D/g, "") || 1001);

    return {
      maintenance_id: String(numericId),
      vehicle_id: String(index + 1),
      maintenance_type: source?.type ?? "Preventive Maintenance",
      description: source ? `${source.vehicle} (${source.plate}) - ${source.type}` : "",
      maintenance_status: (source?.status as MaintenanceStatus) ?? "Scheduled",
      scheduled_date: source?.due ?? "",
      completed_date: "",
      cost: source ? String(source.cost) : "",
      performed_by: "",
      recorded_by: "1",
      created_at: new Date().toISOString(),
    };
  }

  return (
    <div>
      <PageHeader
        title="Maintenance"
        subtitle="Service schedules, repair history, and fleet downtime tracking."
        actions={
          <Btn variant="primary" onClick={() => openServiceModal()}>
            <Plus className="h-4 w-4" /> Schedule service
          </Btn>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPI
          accent
          label="Overdue"
          value={String(overdue)}
          delta="Act now"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <KPI label="In progress" value={String(inProgress)} icon={<Wrench className="h-4 w-4" />} />
        <KPI
          label="Scheduled"
          value={String(scheduled)}
          icon={<CalendarCheck className="h-4 w-4" />}
        />
        <KPI
          label="Service spend (mo)"
          value={peso(totalCost)}
          icon={<Activity className="h-4 w-4" />}
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader title="Service schedule" hint="Sorted by urgency" />
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-semibold">Job</th>
                <th className="px-4 py-3 text-left font-semibold">Vehicle</th>
                <th className="px-4 py-3 text-left font-semibold">Branch</th>
                <th className="px-4 py-3 text-left font-semibold">Due</th>
                <th className="px-4 py-3 text-right font-semibold">Cost</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {maintenance.map((m, index) => (
                <tr key={m.id} className="border-b border-border/60 hover:bg-secondary/40">
                  <td className="px-4 py-3">
                    <div className="font-mono text-xs text-muted-foreground">{m.id}</div>
                    <div className="font-medium">{m.type}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{m.vehicle}</div>
                    <div className="font-mono text-[11px] text-muted-foreground">{m.plate}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{m.branch}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.due}</td>
                  <td className="px-4 py-3 text-right font-display font-semibold">
                    {peso(m.cost)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge>{m.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Btn variant="primary" onClick={() => openServiceModal(index)}>
                      Service now
                    </Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <CardHeader title="Fleet downtime" hint="Days out of service per month" />
          <div className="h-64 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={downtime}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="m"
                  tick={{ fill: "oklch(0.72 0.015 250)", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "oklch(0.72 0.015 250)", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.23 0.03 260)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="days" fill="oklch(0.84 0.16 92)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <MaintenanceRecordDialog
        open={serviceModalOpen}
        draft={draft}
        onDraftChange={setDraft}
        onOpenChange={setServiceModalOpen}
      />
    </div>
  );
}
