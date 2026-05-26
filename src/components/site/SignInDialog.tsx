import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Apple, ArrowRight, Chrome, Facebook, LockKeyhole, UserRound, X } from "lucide-react";
import { continueWithProvider, hasApiCredentialLogin, signInWithCredentialsApi, type AuthProvider } from "@/lib/auth-integration";
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

const providerOptions: { provider: AuthProvider; label: string; icon: typeof Chrome }[] = [
  { provider: "google", label: "Continue with Google", icon: Chrome },
  { provider: "facebook", label: "Continue with Facebook", icon: Facebook },
  { provider: "apple", label: "Continue with Apple", icon: Apple },
];

export function SignInForm({
  closeOnSuccess = false,
  onSuccess,
  onProviderContinue,
}: {
  closeOnSuccess?: boolean;
  onSuccess?: () => void;
  onProviderContinue?: (provider: AuthProvider) => Promise<void> | void;
}) {
  const navigate = useNavigate();
  const identifierRef = useRef<HTMLInputElement>(null);
  const [identifier, setIdentifier] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [providerLoading, setProviderLoading] = useState<AuthProvider | null>(null);

  useEffect(() => {
    identifierRef.current?.focus();
  }, []);

  useEffect(() => {
    if (getAdminSession()) {
      void navigate({ to: "/admin", replace: true });
    }
  }, [navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const trimmedIdentifier = identifier.trim();

      if (hasApiCredentialLogin()) {
        const result = await signInWithCredentialsApi({
          identifier: trimmedIdentifier,
          password,
        });

        if (!result.ok) {
          setError(result.message ?? "Unable to sign in.");
          return;
        }
      } else if (!signInAdmin(trimmedIdentifier, password)) {
        setError("Use admin / admin123 (owner) or staff / staff123 (staff).");
        return;
      }

      if (closeOnSuccess) {
        onSuccess?.();
      }

      void navigate({ to: "/admin", replace: true });
    } catch {
      setError("Sign-in request failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleProviderContinue(provider: AuthProvider) {
    setError("");
    setProviderLoading(provider);

    try {
      if (onProviderContinue) {
        await onProviderContinue(provider);
      } else {
        continueWithProvider(provider);
      }
    } catch {
      setError(`Unable to continue with ${provider}.`);
    } finally {
      setProviderLoading(null);
    }
  }

  return (
    <>
      <div className="pr-9">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Admin access
        </p>
        <h2 id="admin-sign-in-title" className="mt-3 font-display text-2xl font-semibold">
          Sign in to dashboard
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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
          disabled={submitting || providerLoading !== null}
          className="touch-target inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Signing in..." : "Sign in"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        <span>or continue with</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="space-y-2">
        {providerOptions.map((option) => (
          <button
            key={option.provider}
            type="button"
            onClick={() => void handleProviderContinue(option.provider)}
            disabled={submitting || providerLoading !== null}
            className="touch-target inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option.icon className="h-4 w-4" />
            {providerLoading === option.provider ? `Connecting ${option.provider}...` : option.label}
          </button>
        ))}
      </div>
    </>
  );
}
