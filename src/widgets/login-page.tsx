import { BoxesIcon } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "@/features/auth/login-form";
import { ROUTES } from "@/shared/routes/routes";
import { ThemeSwitcher } from "@/shared/ui/theme-switcher";

export function LoginPage() {
  return (
    <div className="min-h-screen bg-background/75">
      <header className="border-b bg-background/95">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href={ROUTES.home}
            className="flex min-h-11 items-center gap-2 font-semibold"
          >
            <BoxesIcon aria-hidden="true" className="text-primary" />
            bulletproof-nextjs
          </Link>
          <ThemeSwitcher />
        </div>
      </header>
      <main
        id="main-content"
        className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2"
      >
        <section className="flex flex-col gap-5">
          <p className="blueprint-kicker">Local validation demo</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Verify the form boundary before connecting identity.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            This route makes no authentication request and creates no session.
            It demonstrates accessible validation behavior only.
          </p>
        </section>
        <LoginForm />
      </main>
    </div>
  );
}
