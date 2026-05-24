import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { Btn, Card, CardHeader, PageHeader } from "@/components/admin/ui";
import { notifications } from "@/data/admin";

export const Route = createFileRoute("/admin/notifications")({ component: NotificationsPage });

const categories = ["All", "Booking", "Payment", "Maintenance", "Return", "Availability", "Verification"];

function NotificationsPage() {
  const [cat, setCat] = useState("All");
  const list = cat === "All" ? notifications : notifications.filter((n) => n.category === cat);

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Categorized operational alerts and reminders."
        actions={
          <>
            <Btn><Check className="h-4 w-4" /> Mark all read</Btn>
            <Btn variant="danger"><Trash2 className="h-4 w-4" /> Clear archive</Btn>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[200px_1fr]">
        <Card className="self-start">
          <CardHeader title="Categories" />
          <ul className="p-2">
            {categories.map((c) => (
              <li key={c}>
                <button onClick={() => setCat(c)}
                        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm ${cat === c ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"}`}>
                  <span>{c}</span>
                  <span className="text-[10px] text-muted-foreground">{c === "All" ? notifications.length : notifications.filter((n) => n.category === c).length}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title={`${cat} notifications`} hint={`${list.length} items`} right={<Bell className="h-4 w-4 text-primary" />} />
          <ul className="divide-y divide-border">
            {list.map((n) => (
              <li key={n.id} className={`flex items-center gap-4 px-5 py-4 ${n.unread ? "bg-primary/5" : ""}`}>
                <span className={`grid h-9 w-9 place-items-center rounded-md ${n.unread ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
                  <Bell className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{n.category}</span>
                    {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                  </div>
                  <div className="mt-0.5 truncate font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{n.when}</div>
                </div>
                <Btn variant="ghost">Open</Btn>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
