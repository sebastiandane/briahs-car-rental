import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Apple,
  ArrowRight,
  Chrome,
  Facebook,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
  X,
} from "lucide-react";
import {
  continueWithProvider,
  hasApiCredentialLogin,
  hasApiSignup,
  signInWithCredentialsApi,
  signUpWithCredentialsApi,
  type AuthProvider,
} from "@/lib/auth-integration";
import { getAdminSession, signInAdmin } from "@/lib/admin-auth";
import { setCustomerSession, type CustomerSession } from "@/lib/customer-auth";

type AuthMode = "sign-in" | "sign-up";

type LocalSignupRecord = {
  user_id: number;
  user_type: string;
  full_name: string;
  email: string;
  phone_number: string;
  password_hash: string;
  account_status: string;
  last_login: string | null;
  created_at: string;
  updated_at: string;
};

const LOCAL_SIGNUPS_KEY = "briahs-user-signups";
const DEFAULT_CUSTOMER_ACCOUNT: LocalSignupRecord = {
  user_id: 0,
  user_type: "Customers / Renters",
  full_name: "Customer Demo",
  email: "customer@briahs.local",
  phone_number: "+63 900 000 0000",
  password_hash: "customer123",
  account_status: "Active",
  last_login: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const providerOptions: { provider: AuthProvider; label: string; icon: typeof Chrome }[] = [
  { provider: "google", label: "Continue with Google", icon: Chrome },
  { provider: "facebook", label: "Continue with Facebook", icon: Facebook },
  { provider: "apple", label: "Continue with Apple", icon: Apple },
];

const SIGNUP_USER_TYPE = "Customers / Renters" as const;

export function SignInDialog({
  open,
  onOpenChange,
  closeOnSuccess = true,
  initialMode = "sign-in",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  closeOnSuccess?: boolean;
  initialMode?: AuthMode;
}) {
  const [mode, setMode] = useState<AuthMode>("sign-in");

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

  useEffect(() => {
    if (open) {
      setMode(initialMode);
    }
  }, [initialMode, open]);

  if (!open) return null;

  return (
    <div
      aria-modal="true"
      aria-labelledby="auth-dialog-title"
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/65 px-4 py-6 backdrop-blur-sm sm:py-8"
      role="dialog"
      onMouseDown={() => onOpenChange(false)}
    >
      <div
        className={`relative my-auto w-full rounded-xl border border-border bg-card p-4 text-foreground shadow-card sm:p-5 ${
          mode === "sign-up" ? "max-w-lg" : "max-w-md"
        }`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close auth dialog"
          onClick={() => onOpenChange(false)}
          className="touch-target absolute right-3 top-3 grid place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5 grid grid-cols-2 gap-1 rounded-md border border-border bg-background p-1">
          <button
            type="button"
            onClick={() => setMode("sign-in")}
            className={`rounded px-3 py-2 text-sm font-semibold transition-colors ${
              mode === "sign-in"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode("sign-up")}
            className={`rounded px-3 py-2 text-sm font-semibold transition-colors ${
              mode === "sign-up"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign up
          </button>
        </div>

        {mode === "sign-in" ? (
          <SignInForm
            closeOnSuccess={closeOnSuccess}
            onSuccess={() => onOpenChange(false)}
            onSwitchToSignUp={() => setMode("sign-up")}
          />
        ) : (
          <SignUpForm
            onSwitchToSignIn={() => setMode("sign-in")}
            onProviderContinue={(provider) => continueWithProvider(provider)}
          />
        )}
      </div>
    </div>
  );
}

export function SignInForm({
  closeOnSuccess = false,
  onSuccess,
  onProviderContinue,
  onSwitchToSignUp,
}: {
  closeOnSuccess?: boolean;
  onSuccess?: () => void;
  onProviderContinue?: (provider: AuthProvider) => Promise<void> | void;
  onSwitchToSignUp?: () => void;
}) {
  const navigate = useNavigate();
  const identifierRef = useRef<HTMLInputElement>(null);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
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
      } else {
        if (signInAdmin(trimmedIdentifier, password)) {
          if (closeOnSuccess) {
            onSuccess?.();
          }
          void navigate({ to: "/admin", replace: true });
          return;
        }

        if (signInCustomerPrototype(trimmedIdentifier, password)) {
          if (closeOnSuccess) {
            onSuccess?.();
          }
          void navigate({ to: "/customer-landing", replace: true });
          return;
        }

        setError("Invalid username/email or password.");
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
          Access portal
        </p>
        <h2 id="auth-dialog-title" className="mt-3 font-display text-2xl font-semibold">
          Welcome back
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
              id="auth-identifier"
              placeholder="Enter username or email"
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
              id="auth-password"
              placeholder="Enter password"
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

      <SocialProviderButtons
        submitting={submitting}
        providerLoading={providerLoading}
        onContinue={handleProviderContinue}
      />

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Sign up
        </button>
      </p>
    </>
  );
}

function SignUpForm({
  onSwitchToSignIn,
  onProviderContinue,
}: {
  onSwitchToSignIn: () => void;
  onProviderContinue: (provider: AuthProvider) => Promise<void> | void;
}) {
  const fullNameRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [providerLoading, setProviderLoading] = useState<AuthProvider | null>(null);

  useEffect(() => {
    fullNameRef.current?.focus();
  }, []);

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhone || !password) {
      setError("Please complete all required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      if (hasApiSignup()) {
        const result = await signUpWithCredentialsApi({
          user_type: SIGNUP_USER_TYPE,
          full_name: trimmedName,
          email: trimmedEmail,
          phone_number: trimmedPhone,
          password,
          account_status: "Active",
        });

        if (!result.ok) {
          setError(result.message ?? "Unable to sign up right now.");
          return;
        }

        setNotice("Account created. You can now sign in.");
      } else {
        const didSave = saveLocalPrototypeSignup({
          user_type: SIGNUP_USER_TYPE,
          full_name: trimmedName,
          email: trimmedEmail,
          phone_number: trimmedPhone,
          password,
        });

        if (!didSave.ok) {
          setError(didSave.message ?? "Unable to save signup.");
          return;
        }

        setNotice("Signup saved for prototype. Connect signup API to create live accounts.");
      }

      setPassword("");
      setConfirmPassword("");
    } catch {
      setError("Signup request failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleProviderSignupContinue(provider: AuthProvider) {
    setError("");
    setProviderLoading(provider);

    try {
      await onProviderContinue(provider);
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
          Create account
        </p>
        <h2 id="auth-dialog-title" className="mt-3 font-display text-2xl font-semibold">
          Sign up
        </h2>
      </div>

      <form onSubmit={handleSignup} className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-foreground">Full name</span>
          <span className="mt-2 flex h-11 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm focus-within:border-primary">
            <UserRound className="h-4 w-4 text-muted-foreground" />
            <input
              ref={fullNameRef}
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
              autoComplete="name"
              placeholder="Juan Dela Cruz"
            />
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">Email</span>
          <span className="mt-2 flex h-11 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm focus-within:border-primary">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
              autoComplete="email"
              placeholder="name@example.com"
              type="email"
            />
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">Phone number</span>
          <span className="mt-2 flex h-11 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm focus-within:border-primary">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <input
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
              autoComplete="tel"
              placeholder="+63 9XX XXX XXXX"
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
              className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              type="password"
            />
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">Confirm password</span>
          <span className="mt-2 flex h-11 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm focus-within:border-primary">
            <LockKeyhole className="h-4 w-4 text-muted-foreground" />
            <input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
              autoComplete="new-password"
              placeholder="Re-enter password"
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

        {notice && (
          <div
            aria-live="polite"
            className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300"
          >
            {notice}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || providerLoading !== null}
          className="touch-target inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Create account"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <SocialProviderButtons
        submitting={submitting}
        providerLoading={providerLoading}
        onContinue={handleProviderSignupContinue}
      />

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Sign in
        </button>
      </p>
    </>
  );
}

function SocialProviderButtons({
  submitting,
  providerLoading,
  onContinue,
}: {
  submitting: boolean;
  providerLoading: AuthProvider | null;
  onContinue: (provider: AuthProvider) => Promise<void>;
}) {
  return (
    <>
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
            onClick={() => void onContinue(option.provider)}
            disabled={submitting || providerLoading !== null}
            className="touch-target inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option.icon className="h-4 w-4" />
            {providerLoading === option.provider
              ? `Connecting ${option.provider}...`
              : option.label}
          </button>
        ))}
      </div>
    </>
  );
}

function hasBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readLocalPrototypeSignups() {
  if (!hasBrowserStorage()) return [] as LocalSignupRecord[];

  const raw = window.localStorage.getItem(LOCAL_SIGNUPS_KEY);
  if (!raw) return [] as LocalSignupRecord[];

  try {
    const parsed = JSON.parse(raw) as LocalSignupRecord[];
    if (!Array.isArray(parsed)) return [] as LocalSignupRecord[];
    return parsed;
  } catch {
    window.localStorage.removeItem(LOCAL_SIGNUPS_KEY);
    return [] as LocalSignupRecord[];
  }
}

function getPrototypeCustomerAccounts() {
  return [DEFAULT_CUSTOMER_ACCOUNT, ...readLocalPrototypeSignups()].filter(
    (record) => record.user_type === "Customers / Renters",
  );
}

function signInCustomerPrototype(identifier: string, password: string) {
  if (!hasBrowserStorage()) return false;

  const normalizedIdentifier = identifier.trim().toLowerCase();
  const account = getPrototypeCustomerAccounts().find(
    (record) =>
      record.email.toLowerCase() === normalizedIdentifier ||
      record.full_name.toLowerCase() === normalizedIdentifier,
  );

  if (!account || account.password_hash !== password || account.account_status !== "Active") {
    return false;
  }

  const session: CustomerSession = {
    name: account.full_name,
    email: account.email,
    user_type: "Customers / Renters",
    signedInAt: new Date().toISOString(),
  };

  setCustomerSession(session);
  return true;
}

function saveLocalPrototypeSignup({
  user_type,
  full_name,
  email,
  phone_number,
  password,
}: {
  user_type: string;
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
}) {
  if (!hasBrowserStorage()) {
    return { ok: false, message: "Storage is not available in this browser." };
  }

  const existing = readLocalPrototypeSignups();
  if (
    getPrototypeCustomerAccounts().some(
      (record) => record.email.toLowerCase() === email.toLowerCase(),
    )
  ) {
    return { ok: false, message: "Email is already registered in local prototype data." };
  }

  const now = new Date().toISOString();
  const nextId = existing.length ? Math.max(...existing.map((record) => record.user_id)) + 1 : 1;
  const newRecord: LocalSignupRecord = {
    user_id: nextId,
    user_type,
    full_name,
    email,
    phone_number,
    password_hash: password,
    account_status: "Active",
    last_login: null,
    created_at: now,
    updated_at: now,
  };

  window.localStorage.setItem(LOCAL_SIGNUPS_KEY, JSON.stringify([...existing, newRecord]));
  return { ok: true };
}
