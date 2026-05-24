import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowRight, LockKeyhole, UserRound } from "lucide-react";
import { getAdminSession, signInAdmin } from "@/lib/admin-auth";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "Admin Sign In - Briah's Car Rental" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  useEffect(() => {
    if (getAdminSession()) {
      void navigate({ to: "/admin", replace: true });
    }
  }, [navigate]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!signInAdmin(identifier, password)) {
      setError("Use admin / admin123 to open the local admin dashboard.");
      return;
    }

    void navigate({ to: "/admin", replace: true });
  }

  return (
    <main className="grid min-h-screen bg-background px-5 py-10 text-foreground lg:grid-cols-[1.05fr_0.95fr] lg:px-0 lg:py-0">
      <section className="hidden min-h-screen flex-col justify-between border-r border-border bg-surface/70 px-12 py-10 lg:flex">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary font-display font-bold text-primary-foreground">
            B
          </span>
          <span className="font-display text-base font-semibold uppercase tracking-[0.04em]">
            Briah's <span className="text-primary">Car Rental</span>
          </span>
        </Link>

        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Admin access
          </p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight">
            Manage bookings, fleet, payments, and branches from one dashboard.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-6 text-muted-foreground">
            This local sign-in is for development and demos. Replace it with a real auth provider
            before deploying the admin area publicly.
          </p>
        </div>

        <div className="text-xs text-muted-foreground">
          Local demo credentials: <span className="text-foreground">admin / admin123</span>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-md flex-col justify-center">
        <Link to="/" className="mb-10 flex items-center gap-2.5 lg:hidden">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary font-display font-bold text-primary-foreground">
            B
          </span>
          <span className="font-display text-base font-semibold uppercase tracking-[0.04em]">
            Briah's <span className="text-primary">Car Rental</span>
          </span>
        </Link>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Welcome back
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold">Sign in to admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Use <span className="text-foreground">admin</span> and{" "}
            <span className="text-foreground">admin123</span> for local access.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-foreground">Username or email</span>
            <span className="mt-2 flex h-11 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm focus-within:border-primary">
              <UserRound className="h-4 w-4 text-muted-foreground" />
              <input
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                autoComplete="username"
                placeholder="admin"
              />
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-foreground">Password</span>
            <span className="mt-2 flex h-11 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm focus-within:border-primary">
              <LockKeyhole className="h-4 w-4 text-muted-foreground" />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                autoComplete="current-password"
                placeholder="admin123"
                type="password"
              />
            </span>
          </label>

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign in
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </section>
    </main>
  );
}
