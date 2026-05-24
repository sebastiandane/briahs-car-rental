import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground font-display font-bold">
            B
            <span className="absolute -inset-px rounded-md ring-1 ring-primary/40" />
          </span>
          <span className="font-display text-base font-semibold tracking-[0.04em] uppercase">
            Briah's <span className="text-primary">Car Rental</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-9 text-sm font-medium text-muted-foreground md:flex">
          <Link
            to="/"
            activeProps={{ className: "text-foreground" }}
            activeOptions={{ exact: true }}
            className="hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            to="/vehicles"
            activeProps={{ className: "text-foreground" }}
            className="hover:text-primary transition-colors"
          >
            Vehicles
          </Link>
          <Link
            to="/booking"
            activeProps={{ className: "text-foreground" }}
            className="hover:text-primary transition-colors"
          >
            Booking
          </Link>
          <Link
            to="/contact"
            activeProps={{ className: "text-foreground" }}
            className="hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </nav>

        <Link
          to="/sign-in"
          className="inline-flex h-9 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
        >
          Sign In
        </Link>
      </div>
    </header>
  );
}
