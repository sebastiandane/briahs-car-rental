import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarRange,
  Users,
  Car,
  CreditCard,
  Wrench,
  CalendarDays,
  BarChart3,
  Brain,
  Building2,
  Bell,
  ShieldCheck,
  Settings,
  Search,
  LogOut,
} from "lucide-react";
import briahLogo from "@/assets/briah-logo.png";
import { getAdminSession, signOutAdmin } from "@/lib/admin-auth";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarRange },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/fleet", label: "Fleet Management", icon: Car },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/admin/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/admin/reports", label: "Reports & Analytics", icon: BarChart3 },
  { to: "/admin/decisions", label: "Decision Support", icon: Brain },
  { to: "/admin/branches", label: "Branches", icon: Building2 },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/users", label: "Users & Roles", icon: ShieldCheck },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = nav.find((n) => (n.exact ? pathname === n.to : pathname.startsWith(n.to)));
  const [session, setSession] = useState<ReturnType<typeof getAdminSession> | undefined>();

  useEffect(() => {
    const activeSession = getAdminSession();
    if (!activeSession) {
      void navigate({ to: "/sign-in", replace: true });
      return;
    }
    setSession(activeSession);
  }, [navigate]);

  function handleSignOut() {
    signOutAdmin();
    void navigate({ to: "/sign-in", replace: true });
  }

  if (session === undefined) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6 text-center text-foreground">
        <div>
          <img
            src={briahLogo}
            alt="Briah's Car Rental"
            className="mx-auto h-16 w-16 rounded-md object-cover"
          />
          <p className="mt-4 text-sm text-muted-foreground">Checking admin session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-surface/80 backdrop-blur lg:flex">
        <Link to="/" className="flex h-16 items-center gap-3 border-b border-border px-5">
          <span className="block h-12 w-28 overflow-hidden rounded-md">
            <img src={briahLogo} alt="Briah's Car Rental" className="h-full w-full object-cover" />
          </span>
          <div className="leading-tight">
            <div className="font-display text-sm font-semibold uppercase tracking-wider">Admin</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Operations
            </div>
          </div>
        </Link>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Workspace
          </div>
          <ul className="space-y-0.5">
            {nav.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to as never}
                  activeProps={{ className: "bg-primary/10 text-primary border-primary/30" }}
                  activeOptions={n.exact ? { exact: true } : undefined}
                  className="group flex items-center gap-3 rounded-md border border-transparent px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                >
                  <n.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{n.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-md bg-card px-3 py-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 font-display text-xs font-semibold text-primary">
              KI
            </span>
            <div className="leading-tight">
              <div className="text-[13px] font-medium">{session.name}</div>
              <div className="text-[11px] text-muted-foreground">{session.role}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex min-h-16 items-center gap-4 border-b border-border bg-background/85 px-4 backdrop-blur md:px-8">
          <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
            <span>Admin</span>
            <span className="text-border">/</span>
            <span className="truncate text-foreground">{current?.label ?? "Dashboard"}</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <label className="hidden min-h-11 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-muted-foreground md:flex">
              <Search className="h-4 w-4" />
              <input
                className="w-56 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                placeholder="Search bookings, plates, customers"
              />
              <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px]">⌘K</kbd>
            </label>
            <Link
              to={"/admin/notifications" as never}
              aria-label="Notifications"
              className="touch-target relative grid place-items-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                3
              </span>
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="touch-target flex items-center gap-2 rounded-md border border-border bg-card px-2.5 text-sm transition-colors hover:bg-secondary"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/15 text-[10px] font-semibold text-primary">
                KI
              </span>
              <span className="hidden md:inline">Sign out</span>
              <LogOut className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        </header>

        <nav className="border-b border-border bg-surface/80 px-4 py-3 lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Admin sections">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to as never}
                activeProps={{ className: "bg-primary/10 text-primary border-primary/30" }}
                activeOptions={n.exact ? { exact: true } : undefined}
                className="touch-target inline-flex shrink-0 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <n.icon className="h-4 w-4 shrink-0" />
                <span>{n.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
