import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { SignInDialog } from "@/components/site/SignInDialog";
import { clearCustomerSession, getCustomerSession } from "@/lib/customer-auth";

export function Header() {
  const navigate = useNavigate();
  const [signInOpen, setSignInOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const customerSession = getCustomerSession();
  const showCustomerDashboardLink = customerSession != null;
  const navLinks = [
    { to: "/", label: "Home", exact: true },
    { to: "/vehicles", label: "Vehicles" },
    { to: "/booking", label: "Booking" },
    { to: "/contact", label: "Contact" },
    ...(showCustomerDashboardLink ? [{ to: "/customer", label: "Customer Dashboard" }] : []),
  ] as const;

  function openSignIn() {
    setMenuOpen(false);
    setSignInOpen(true);
  }

  function signOut() {
    clearCustomerSession();
    setMenuOpen(false);
    setSignInOpen(false);
    void navigate({ to: "/", replace: true });
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-page flex min-h-16 items-center justify-between gap-3">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex min-w-0 items-center rounded-md text-foreground transition-colors hover:text-primary"
          >
            <span className="truncate font-display text-base font-semibold tracking-tight sm:text-lg">
              Briah&apos;s Car Rental
            </span>
          </Link>

          <nav className="hidden items-center gap-9 text-sm font-medium text-muted-foreground md:flex">
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "text-foreground" }}
                activeOptions={item.exact ? { exact: true } : undefined}
                className="rounded-sm transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {customerSession ? (
              <button
                type="button"
                onClick={signOut}
                className="touch-target hidden items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:inline-flex"
              >
                Sign out
              </button>
            ) : (
              <button
                type="button"
                onClick={openSignIn}
                className="touch-target hidden items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:inline-flex"
              >
                Sign In / Sign Up
              </button>
            )}
            <button
              type="button"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="touch-target grid place-items-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-secondary md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-border bg-background/95 md:hidden">
            <nav className="container-page grid gap-2 py-3 text-sm font-medium text-muted-foreground">
              {navLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeProps={{ className: "bg-primary/10 text-primary border-primary/30" }}
                  activeOptions={item.exact ? { exact: true } : undefined}
                  onClick={() => setMenuOpen(false)}
                  className="touch-target flex items-center rounded-md border border-transparent px-3 transition-colors hover:bg-card hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
              {customerSession ? (
                <button
                  type="button"
                  onClick={signOut}
                  className="touch-target inline-flex w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Sign out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openSignIn}
                  className="touch-target inline-flex w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Sign In / Sign Up
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      <SignInDialog open={signInOpen} onOpenChange={setSignInOpen} />
    </>
  );
}
