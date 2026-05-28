import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, RadialBarChart, RadialBar, PolarAngleAxis,
} from "recharts";
import { Card, CardHeader, KPI, PageHeader } from "@/components/admin/ui";
import { bookingVolume, branchPerformance, fleetUtilization, kpis, maintenance, peso, revenueTrend } from "@/data/admin";
import { BarChart3, TrendingUp, Wallet, Car } from "lucide-react";
import { getAdminSession, isStaffRole } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/reports")({ component: ReportsPage });

const goldGrid = "rgba(255,255,255,0.06)";

function ReportsPage() {
  const session = getAdminSession();
  const staffView = isStaffRole(session?.role);

  const maintenanceCounts = maintenance.reduce(
    (acc, item) => {
      acc.total += 1;
      acc.byStatus[item.status] = (acc.byStatus[item.status] ?? 0) + 1;
      return acc;
    },
    { total: 0, byStatus: {} as Record<string, number> },
  );

  if (staffView) {
    return (
      <div>
        <PageHeader
          title="Operational reports"
          subtitle="Bookings, utilization, and service workload (non-financial)."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KPI accent label="Total bookings" value={kpis.totalBookings.toLocaleString()} delta="+8.4% MoM" icon={<BarChart3 className="h-4 w-4" />} />
          <KPI label="Active rentals" value={String(kpis.activeRentals)} delta="+3 today" icon={<Car className="h-4 w-4" />} />
          <KPI label="Available vehicles" value={String(kpis.availableVehicles)} delta="of 56 fleet" icon={<Car className="h-4 w-4" />} />
          <KPI label="Maintenance tasks" value={String(kpis.maintenance)} delta={`${maintenanceCounts.byStatus["Overdue"] ?? 0} overdue`} icon={<TrendingUp className="h-4 w-4" />} />
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader title="Weekly booking volume" hint="Taft vs Antipolo" />
            <div className="h-72 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingVolume}>
                  <CartesianGrid stroke={goldGrid} vertical={false} />
                  <XAxis dataKey="d" tick={{ fill: "oklch(0.72 0.015 250)", fontSize: 11 }} axisLine={{ stroke: goldGrid }} tickLine={false} />
                  <YAxis tick={{ fill: "oklch(0.72 0.015 250)", fontSize: 11 }} axisLine={{ stroke: goldGrid }} tickLine={false} />
                  <Tooltip contentStyle={{ background: "oklch(0.23 0.03 260)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="taft" fill="oklch(0.84 0.16 92)" radius={[3,3,0,0]} />
                  <Bar dataKey="antipolo" fill="oklch(0.45 0.05 260)" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader title="Utilization snapshot" hint="Fleet-wide" />
            <div className="grid h-72 place-items-center p-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="65%" outerRadius="100%" data={[{ name: "u", value: 74, fill: "oklch(0.84 0.16 92)" }]} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar background={{ fill: "oklch(0.28 0.025 260)" }} dataKey="value" cornerRadius={20} />
                  <text x="50%" y="48%" textAnchor="middle" className="fill-foreground" style={{ fontSize: 32, fontWeight: 600 }}>74%</text>
                  <text x="50%" y="60%" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 11 }}>Active rental hours</text>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader title="Top performing categories" hint="Utilization rate" />
            <div className="space-y-3 p-5">
              {[...fleetUtilization].sort((a,b) => b.util - a.util).map((f, i) => (
                <div key={f.cat} className="flex items-center gap-4">
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-primary/15 font-display text-xs font-semibold text-primary">{i + 1}</span>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between text-xs"><span className="font-medium">{f.cat}</span><span className="text-muted-foreground">{f.util}%</span></div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${f.util}%` }} /></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Maintenance workload" hint="Current queue" />
            <div className="space-y-3 p-5 text-sm">
              {Object.entries(maintenanceCounts.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between rounded-md border border-border bg-secondary/30 px-3 py-2">
                  <span className="text-muted-foreground">{status}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Reports & analytics"
        subtitle="Executive view of revenue, utilization, and branch performance."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPI accent label="Revenue YTD"   value={peso(22_840_000)} delta="+18.6% YoY" icon={<Wallet className="h-4 w-4" />} />
        <KPI       label="Bookings YTD"   value="9,412" delta="+2,184 vs LY" icon={<BarChart3 className="h-4 w-4" />} />
        <KPI       label="Avg utilization" value="74%" delta="+6 pts" icon={<Car className="h-4 w-4" />} />
        <KPI       label="Avg ticket"     value={peso(7240)} delta="+₱412 MoM" icon={<TrendingUp className="h-4 w-4" />} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader title="Monthly revenue" hint="₱ thousands" />
          <div className="h-72 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrend}>
                <CartesianGrid stroke={goldGrid} vertical={false} />
                <XAxis dataKey="m" tick={{ fill: "oklch(0.72 0.015 250)", fontSize: 11 }} axisLine={{ stroke: goldGrid }} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.72 0.015 250)", fontSize: 11 }} axisLine={{ stroke: goldGrid }} tickLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.23 0.03 260)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="v" stroke="oklch(0.84 0.16 92)" strokeWidth={2.5} dot={{ fill: "oklch(0.84 0.16 92)", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Overall utilization" hint="Fleet-wide" />
          <div className="grid h-72 place-items-center p-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="65%" outerRadius="100%" data={[{ name: "u", value: 74, fill: "oklch(0.84 0.16 92)" }]} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background={{ fill: "oklch(0.28 0.025 260)" }} dataKey="value" cornerRadius={20} />
                <text x="50%" y="48%" textAnchor="middle" className="fill-foreground" style={{ fontSize: 32, fontWeight: 600 }}>74%</text>
                <text x="50%" y="60%" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 11 }}>Active rental hours</text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Branch performance" hint="Active rentals vs available fleet" />
          <div className="h-64 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchPerformance}>
                <CartesianGrid stroke={goldGrid} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "oklch(0.72 0.015 250)", fontSize: 11 }} axisLine={{ stroke: goldGrid }} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.72 0.015 250)", fontSize: 11 }} axisLine={{ stroke: goldGrid }} tickLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.23 0.03 260)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="active" fill="oklch(0.84 0.16 92)" radius={[3,3,0,0]} />
                <Bar dataKey="fleet" fill="oklch(0.45 0.05 260)" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Top performing categories" />
          <div className="space-y-3 p-5">
            {[...fleetUtilization].sort((a,b) => b.util - a.util).map((f, i) => (
              <div key={f.cat} className="flex items-center gap-4">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-primary/15 font-display text-xs font-semibold text-primary">{i + 1}</span>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between text-xs"><span className="font-medium">{f.cat}</span><span className="text-muted-foreground">{f.util}%</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${f.util}%` }} /></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
