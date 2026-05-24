import { createFileRoute, Link } from "@tanstack/react-router";
import briahLogo from "@/assets/briah-logo.png";
import { SignInForm } from "@/components/site/SignInDialog";

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
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-8 text-foreground">
      <div className="w-full max-w-md">
        <Link to="/" className="mx-auto mb-6 block h-20 w-56 overflow-hidden rounded-md">
          <img src={briahLogo} alt="Briah's Car Rental" className="h-full w-full object-cover" />
        </Link>

        <section className="rounded-xl border border-border bg-card p-6 shadow-card">
          <SignInForm />
        </section>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          This local sign-in is for development and demos. Replace it before public deployment.
        </p>
      </div>
    </main>
  );
}
