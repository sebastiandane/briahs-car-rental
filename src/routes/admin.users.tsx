import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, User, UserPlus, Users } from "lucide-react";
import { Badge, Btn, Card, CardHeader, PageHeader } from "@/components/admin/ui";
import { users } from "@/data/admin";
import { canAccessPayments, getAdminSession } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/users")({ component: UsersPage });

const roleSummary = [
  {
    role: "Business Owner",
    icon: ShieldCheck,
    accountType: "Primary operations authority",
    perms: [
      "Full access to operational records and payment information",
      "Approves rentals and vehicle allocation decisions",
      "Monitors maintenance activities and operational reports",
      "Oversees branch operations and final operational decisions",
    ],
  },
  {
    role: "Administrator / Staff",
    icon: Users,
    accountType: "Operations and coordination account",
    perms: [
      "Handles reservation coordination and booking schedule monitoring",
      "Manages customer communication and calendar updates",
      "Submits operational updates for daily branch work",
      "Limited access to sensitive financial and payment records",
    ],
  },
  {
    role: "Customers / Renters",
    icon: User,
    accountType: "Customer service account",
    perms: [
      "Inquires about vehicle availability",
      "Submits reservation requests and rental requirements",
      "Receives booking confirmations",
      "Receives operational updates related to rentals",
    ],
  },
];

function UsersPage() {
  const session = getAdminSession();
  const canManageUsers = canAccessPayments(session?.role);

  return (
    <div>
      <PageHeader
        title="Users & roles"
        subtitle="Manage role-based access for owners, staff, and renters."
        actions={
          <Btn
            variant="primary"
            disabled={!canManageUsers}
            title={canManageUsers ? "Add user" : "Only admin can add users"}
          >
            <UserPlus className="h-4 w-4" /> Add user
          </Btn>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {roleSummary.map((r) => (
          <Card key={r.role} className="p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/15 text-primary">
                <r.icon className="h-4 w-4" />
              </span>
              <div>
                <div className="font-display text-lg font-semibold">{r.role}</div>
                <div className="text-xs text-muted-foreground">{r.accountType}</div>
              </div>
            </div>
            <ul className="mt-4 space-y-1.5 border-t border-border pt-4 text-xs text-muted-foreground">
              {r.perms.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-primary" /> {p}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader title="Accounts" hint={`${users.length} owner, staff, and renter accounts`} />
        <table className="w-full text-sm">
          <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left font-semibold">User</th>
              <th className="px-5 py-3 text-left font-semibold">Role</th>
              <th className="px-5 py-3 text-left font-semibold">Status</th>
              <th className="px-5 py-3 text-left font-semibold">Last active</th>
              <th className="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border/60 hover:bg-secondary/40">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                      {u.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <Badge>{u.role}</Badge>
                </td>
                <td className="px-5 py-3">
                  <Badge>{u.status}</Badge>
                </td>
                <td className="px-5 py-3 text-muted-foreground">2h ago</td>
                <td className="px-5 py-3 text-right">
                  <Btn
                    variant="ghost"
                    disabled={!canManageUsers}
                    title={canManageUsers ? "Edit user" : "Only admin can edit users"}
                  >
                    {canManageUsers ? "Edit" : "View only"}
                  </Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
