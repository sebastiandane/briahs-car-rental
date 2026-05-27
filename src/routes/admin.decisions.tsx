import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { Card, CardHeader, PageHeader, Badge, Btn } from "@/components/admin/ui";
import {
  Brain, Sparkles, AlertTriangle, ArrowRight, CloudRain, Fuel, Route as RouteIcon,
} from "lucide-react";
import { getAdminSession, isStaffRole } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/decisions")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const session = getAdminSession();
    if (!session) throw redirect({ to: "/sign-in" });
    if (isStaffRole(session.role)) throw redirect({ to: "/admin" });
  },
  component: DecisionPage,
});

const goldGrid = "rgba(255,255,255,0.06)";

const forecast = [
  { d: "W-3", actual: 156, forecast: 160 },
  { d: "W-2", actual: 168, forecast: 165 },
  { d: "W-1", actual: 182, forecast: 178 },
  { d: "W0",  actual: 198, forecast: 195 },
  { d: "W+1", actual: null, forecast: 212 },
  { d: "W+2", actual: null, forecast: 224 },
  { d: "W+3", actual: null, forecast: 218 },
];

const idleVehicles = [
  { name: "Toyota Hilux",  plate: "NDA 6610", idle: 18, branch: "Taft" },
  { name: "Honda City",    plate: "NEB 5582", idle: 14, branch: "Taft" },
  { name: "Toyota Avanza", plate: "NCB 1182", idle: 9,  branch: "Antipolo" },
];

const utilRows = [
  { name: "Toyota Hiace",  plate: "NDF 8821", util: 91, trend: "+8%" },
  { name: "Nissan Urvan",  plate: "NDB 4410", util: 87, trend: "+4%" },
  { name: "Toyota Vios",   plate: "NEA 1284", util: 84, trend: "+2%" },
  { name: "Ford Everest",  plate: "NCA 7710", util: 79, trend: "-1%" },
  { name: "Toyota Wigo",   plate: "AAJ 2231", util: 72, trend: "+3%" },
];

const radar = [
  { dim: "Seats",       v: 90 },
  { dim: "Fuel eff.",   v: 65 },
  { dim: "Availability",v: 80 },
  { dim: "Distance fit",v: 88 },
  { dim: "Condition",   v: 92 },
];

function DecisionPage() {
  return (
    <div>
      <PageHeader
        title="Decision support"
        subtitle="Operational intelligence for forecasting, allocation, and vehicle selection."
        actions={<Btn variant="primary"><Sparkles className="h-4 w-4" /> Refresh insights</Btn>}
      />

      {/* 1. Demand forecast */}
      <Card className="mb-4">
        <CardHeader title="Demand forecasting" hint="Weighted moving average • next 3 weeks" right={<Badge>High confidence</Badge>} />
        <div className="h-72 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast}>
              <defs>
                <linearGradient id="dgold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.84 0.16 92)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.84 0.16 92)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={goldGrid} vertical={false} />
              <XAxis dataKey="d" tick={{ fill: "oklch(0.72 0.015 250)", fontSize: 11 }} axisLine={{ stroke: goldGrid }} tickLine={false} />
              <YAxis tick={{ fill: "oklch(0.72 0.015 250)", fontSize: 11 }} axisLine={{ stroke: goldGrid }} tickLine={false} />
              <Tooltip contentStyle={{ background: "oklch(0.23 0.03 260)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="actual" stroke="oklch(0.72 0.015 250)" fill="transparent" strokeWidth={2} />
              <Area type="monotone" dataKey="forecast" stroke="oklch(0.84 0.16 92)" strokeWidth={2.5} fill="url(#dgold)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* 2. Top utilization */}
        <Card>
          <CardHeader title="Vehicle utilization" hint="Top performers (last 30 days)" />
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border"><th className="px-4 py-3 text-left">Vehicle</th><th className="px-4 py-3 text-left">Plate</th><th className="px-4 py-3 text-right">Utilization</th><th className="px-4 py-3 text-right">Trend</th></tr>
            </thead>
            <tbody>
              {utilRows.map((r) => (
                <tr key={r.plate} className="border-b border-border/60">
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.plate}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="ml-auto flex w-32 items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary"><div className="h-full bg-primary" style={{ width: `${r.util}%` }} /></div>
                      <span className="w-9 text-right text-xs">{r.util}%</span>
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-right text-xs ${r.trend.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}>{r.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* 3. Idle detection */}
        <Card>
          <CardHeader title="Idle vehicle detection" hint="Underused fleet to reactivate" right={<AlertTriangle className="h-4 w-4 text-amber-400" />} />
          <ul className="divide-y divide-border">
            {idleVehicles.map((v) => (
              <li key={v.plate} className="flex items-center justify-between px-5 py-4">
                <div>
                  <div className="font-medium">{v.name}</div>
                  <div className="text-xs text-muted-foreground">{v.plate} • {v.branch}</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-xl font-semibold text-amber-400">{v.idle}d</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">idle</div>
                </div>
              </li>
            ))}
            <li className="p-4">
              <Btn className="w-full justify-center"><Sparkles className="h-4 w-4" /> Generate promo for idle units</Btn>
            </li>
          </ul>
        </Card>

        {/* 4. Branch demand */}
        <Card>
          <CardHeader title="Branch demand analysis" />
          <div className="space-y-4 p-5">
            {[
              { name: "Taft, Manila",    high: true,  score: 78, bookings: 412, share: "62%" },
              { name: "Antipolo, Rizal", high: false, score: 62, bookings: 248, share: "38%" },
            ].map((b) => (
              <div key={b.name} className="rounded-lg border border-border bg-background/60 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{b.name}</div>
                    <div className="text-xs text-muted-foreground">{b.bookings} bookings • {b.share} share</div>
                  </div>
                  <Badge>{b.high ? "High demand" : "Steady"}</Badge>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div className={`h-full ${b.high ? "bg-primary" : "bg-muted-foreground/60"}`} style={{ width: `${b.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 5. Rule-based recommendation */}
        <Card>
          <CardHeader title="Vehicle recommendation" hint="For trip: 6 pax, Manila → Baguio (250 km)" right={<Brain className="h-4 w-4 text-primary" />} />
          <div className="grid gap-4 p-5 md:grid-cols-[1fr_1.2fr]">
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radar}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="dim" tick={{ fill: "oklch(0.72 0.015 250)", fontSize: 10 }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar dataKey="v" stroke="oklch(0.84 0.16 92)" fill="oklch(0.84 0.16 92)" fillOpacity={0.35} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Top match</div>
              <div className="mt-1 font-display text-xl font-semibold">Toyota Innova</div>
              <div className="text-xs text-muted-foreground">ABM 9921 • Taft, Manila</div>
              <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <li>• 8 seats — fits 6 pax with luggage</li>
                <li>• Diesel, 12 km/L — efficient for 250 km</li>
                <li>• Available May 26 → 30</li>
                <li>• Excellent condition (last service 2 wks)</li>
              </ul>
              <Btn variant="primary" className="mt-4">Assign vehicle <ArrowRight className="h-4 w-4" /></Btn>
            </div>
          </div>
        </Card>
      </div>

      {/* 6 + 7 */}
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader title="Branch allocation recommendation" />
          <ul className="divide-y divide-border text-sm">
            {[
              { from: "Antipolo, Rizal", to: "Taft, Manila",    unit: "1× Toyota Hiace", reason: "Van demand at Taft up 22% this week" },
              { from: "Taft, Manila",    to: "Antipolo, Rizal", unit: "1× Toyota Rush",  reason: "Antipolo SUV reservations exceeding fleet" },
              { from: "Taft, Manila",    to: "Antipolo, Rizal", unit: "1× Toyota Vios",  reason: "Balance idle sedans" },
            ].map((r, i) => (
              <li key={i} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/15 text-primary"><ArrowRight className="h-4 w-4" /></span>
                  <div>
                    <div className="font-medium">{r.unit}</div>
                    <div className="text-xs text-muted-foreground">{r.from} → {r.to}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{r.reason}</div>
                  </div>
                </div>
                <Btn>Approve transfer</Btn>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Context-aware insights" hint="Weather, road & fuel context" />
          <ul className="divide-y divide-border text-sm">
            <Insight icon={<CloudRain className="h-4 w-4" />} title="Typhoon advisory Signal 1 • Rizal" body="Recommend SUVs for Antipolo bookings May 27–29. Defer self-drive issuances to AT vehicles only." />
            <Insight icon={<RouteIcon className="h-4 w-4" />}     title="NLEX traffic forecast"      body="Heavy outbound flow Friday 4–8 PM. Shift Baguio pickups to before 2 PM." />
            <Insight icon={<Fuel className="h-4 w-4" />}      title="Diesel rollback +₱0.85/L"   body="Adjust van pricing band by +₱150/day to preserve margin starting June 1." />
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Insight({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <li className="flex gap-3 px-5 py-4">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/15 text-primary">{icon}</span>
      <div>
        <div className="font-medium">{title}</div>
        <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{body}</div>
      </div>
    </li>
  );
}
