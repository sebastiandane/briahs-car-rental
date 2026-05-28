import { createFileRoute, Link, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, CreditCard, FileCheck2, FileUp, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { CANCELLATION_POLICY, RENTAL_DONTS, RENTAL_DOS } from "@/data/rental-policy";
import { peso } from "@/data/vehicles";
import { getAdminSession } from "@/lib/admin-auth";
import { getCustomerSession, type CustomerSession } from "@/lib/customer-auth";

export const Route = createFileRoute("/customer")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;

    if (getAdminSession()) {
      throw redirect({ to: "/admin" });
    }

    if (!getCustomerSession()) {
      throw redirect({ to: "/sign-in" });
    }
  },
  head: () => ({
    meta: [
      { title: "Customer View - Briah's Car Rental" },
      {
        name: "description",
        content:
          "Customer portal for requirement uploads, payment status tracking, and booking updates.",
      },
    ],
    links: [{ rel: "canonical", href: "/customer" }],
  }),
  component: CustomerViewPage,
});

type PaymentStatus = "Pending" | "Verified" | "Rejected";

const paymentRows: { ref: string; amount: number; method: string; status: PaymentStatus }[] = [
  { ref: "PAY-4502", amount: 5000, method: "GCash", status: "Pending" },
  { ref: "PAY-4487", amount: 7200, method: "Bank Transfer", status: "Verified" },
  { ref: "PAY-4469", amount: 3000, method: "Over the counter", status: "Rejected" },
];

const notifications = [
  "Booking BK-2101 is pending review.",
  "Payment reminder: reservation hold expires in 12 hours.",
  "Vehicle release reminder: Bring original IDs on pickup day.",
];

function CustomerViewPage() {
  const navigate = useNavigate();
  const hash = useRouterState({ select: (s) => s.location.hash });
  const normalizedHash = hash?.startsWith("#") ? hash.slice(1) : hash ?? "";
  const showRequirementsOnly = normalizedHash === "post-booking";
  const [session, setSession] = useState<CustomerSession | null | undefined>(undefined);
  const [idFileName, setIdFileName] = useState("");
  const [licenseFileName, setLicenseFileName] = useState("");

  useEffect(() => {
    const activeSession = getCustomerSession();
    if (!activeSession) {
      void navigate({ to: "/sign-in", replace: true });
      setSession(null);
      return;
    }
    setSession(activeSession);
  }, [navigate]);

  if (session === undefined) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6 text-center text-foreground">
        <div>
          <div className="font-display text-lg font-semibold tracking-tight">
            Briah&apos;s Car Rental
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Checking customer session...</p>
        </div>
      </div>
    );
  }

  if (session === null) return null;

  if (showRequirementsOnly) {
    return (
      <div>
        <Header />

        <section className="border-b border-border bg-secondary/60">
          <div className="container-page py-14 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Next step
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
              Requirement Submission
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Upload your valid ID and driver&apos;s license to speed up approval.
            </p>
          </div>
        </section>

        <section className="container-page mt-10">
          <Card
            title="Requirement Submission"
            icon={<FileCheck2 className="h-4 w-4 text-primary" />}
          >
            <form
              onSubmit={(event) => {
                event.preventDefault();

                const missing: string[] = [];
                if (!idFileName) missing.push("Valid ID");
                if (!licenseFileName) missing.push("Driver's License");

                if (missing.length > 0) {
                  toast.error("Please upload the required documents.", {
                    description: `Missing: ${missing.join(" and ")}.`,
                  });
                  return;
                }

                toast.success("Requirements uploaded", {
                  description: "ID and driver's license are queued for verification.",
                });

                window.setTimeout(() => {
                  void navigate({ to: "/payment-details" });
                }, 700);
              }}
              className="grid gap-3 sm:grid-cols-2"
            >
              <UploadField
                label="Valid ID"
                helper={idFileName || "Upload government ID"}
                onFilePick={(name) => setIdFileName(name)}
              />
              <UploadField
                label="Driver's License"
                helper={licenseFileName || "Upload front/back copy"}
                onFilePick={(name) => setLicenseFileName(name)}
              />
              <button
                type="submit"
                className="touch-target inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:col-span-2"
              >
                <FileUp className="h-4 w-4" />
                Submit Requirements
              </button>
            </form>

            <div className="mt-4 text-center text-sm">
              <Link
                to="/customer"
                className="font-semibold text-primary transition-colors hover:text-primary/80"
              >
                Go to Customer Dashboard
              </Link>
            </div>
          </Card>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />

      <section className="border-b border-border bg-secondary/60">
        <div className="container-page py-14 text-center">
          <p className="mx-auto max-w-3xl text-sm leading-6 text-muted-foreground">
            Track your payment status and booking updates here.
          </p>
        </div>
      </section>

      <section className="container-page mt-8">
        <div className="space-y-6">
          <Card title="Payment Status" icon={<CreditCard className="h-4 w-4 text-primary" />}>
            <div className="space-y-2">
              {paymentRows.map((row) => (
                <Row
                  key={row.ref}
                  title={`${row.ref} • ${peso(row.amount)}`}
                  subtitle={row.method}
                  status={row.status}
                />
              ))}
            </div>
          </Card>

          <Card title="Notifications and Updates" icon={<Bell className="h-4 w-4 text-primary" />}>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {notifications.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-border bg-secondary/30 px-3 py-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Rental Policies" icon={<ShieldCheck className="h-4 w-4 text-primary" />}>
            <div className="grid gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
                  Do&apos;s
                </div>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                  {RENTAL_DOS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-400">
                  Don&apos;ts
                </div>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                  {RENTAL_DONTS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                {CANCELLATION_POLICY}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h2 className="font-display text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function UploadField({
  label,
  helper,
  onFilePick,
}: {
  label: string;
  helper: string;
  onFilePick: (name: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type="file"
        onChange={(event) => {
          const fileName = event.target.files?.[0]?.name ?? "";
          onFilePick(fileName);
        }}
        className="input-control py-2.5 file:mr-2 file:rounded-md file:border-0 file:bg-primary/15 file:px-2 file:py-1 file:text-xs file:font-semibold file:text-primary"
      />
      <span className="mt-1 block text-xs text-muted-foreground">{helper}</span>
    </label>
  );
}

function Row({ title, subtitle, status }: { title: string; subtitle: string; status: string }) {
  const style =
    status === "Verified"
      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/25"
      : status === "Rejected"
        ? "bg-rose-500/10 text-rose-300 border-rose-500/25"
        : "bg-amber-500/10 text-amber-300 border-amber-500/25";

  return (
    <div className="rounded-md border border-border bg-secondary/30 px-3 py-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${style}`}>
          {status}
        </span>
      </div>
    </div>
  );
}
