import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowRight, LockKeyhole, UserRound, X } from "lucide-react";
import { getAdminSession, signInAdmin } from "@/lib/admin-auth";

export function SignInDialog({
  open,
  onOpenChange,
  closeOnSuccess = true,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  closeOnSuccess?: boolean;
}) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onOpenChange, open]);

  if (!open) return null;

  return (
    <div
      aria-modal="true"
      aria-labelledby="admin-sign-in-title"
      className="fixed inset-0 z-50 grid place-items-center bg-black/65 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      onMouseDown={() => onOpenChange(false)}
    >
      <div
        className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 text-foreground shadow-card"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close sign in"
          onClick={() => onOpenChange(false)}
          className="touch-target absolute right-3 top-3 grid place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <SignInForm closeOnSuccess={closeOnSuccess} onSuccess={() => onOpenChange(false)} />
      </div>
    </div>
  );
}

export function SignInForm({
  closeOnSuccess = false,
  onSuccess,
}: {
  closeOnSuccess?: boolean;
  onSuccess?: () => void;
}) {
  const navigate = useNavigate();
  const identifierRef = useRef<HTMLInputElement>(null);
  const [identifier, setIdentifier] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  useEffect(() => {
    identifierRef.current?.focus();
  }, []);

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

    if (closeOnSuccess) {
      onSuccess?.();
    }

    void navigate({ to: "/admin", replace: true });
  }

  return (
    <>
      <div className="pr-9">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Admin access
        </p>
        <h2 id="admin-sign-in-title" className="mt-3 font-display text-2xl font-semibold">
          Sign in to admin
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Use <span className="text-foreground">admin</span> and{" "}
          <span className="text-foreground">admin123</span> for local access.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-foreground">Username or email</span>
          <span className="mt-2 flex h-11 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm focus-within:border-primary">
            <UserRound className="h-4 w-4 text-muted-foreground" />
            <input
              ref={identifierRef}
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              aria-invalid={Boolean(error)}
              className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
              autoComplete="username"
              id="admin-identifier"
              placeholder="admin"
            />
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">Password</span>
          <span className="mt-2 flex h-11 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm focus-within:border-primary">
            <LockKeyhole className="h-4 w-4 text-muted-foreground" />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(error)}
              className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
              autoComplete="current-password"
              id="admin-password"
              placeholder="admin123"
              type="password"
            />
          </span>
        </label>

        {error && (
          <div
            aria-live="polite"
            className="flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="touch-target inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Sign in
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </>
  );
}
