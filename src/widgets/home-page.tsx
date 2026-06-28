import {
  ArrowRightIcon,
  BoxesIcon,
  BracesIcon,
  CheckCircle2Icon,
  DatabaseZapIcon,
  Layers3Icon,
  ShieldCheckIcon,
} from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/shared/routes/routes";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { ThemeSwitcher } from "@/shared/ui/theme-switcher";

const architecture = [
  {
    icon: Layers3Icon,
    title: "Directed layers",
    description:
      "Routes stay thin while widgets compose features and shared infrastructure.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Validated boundaries",
    description:
      "Zod validates forms and network data before the UI trusts either.",
  },
  {
    icon: BracesIcon,
    title: "Verification first",
    description:
      "TypeScript, Biome, Vitest, MSW, architecture checks, and Playwright are wired in.",
  },
] as const;

const commands = [
  "bun run typecheck",
  "bun run check",
  "bun run test",
  "bun run architecture:check",
] as const;

export function HomePage() {
  return (
    <div className="min-h-screen bg-background/80">
      <header className="border-b bg-background/95">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href={ROUTES.home}
            className="flex min-h-11 items-center gap-2 font-semibold tracking-tight"
          >
            <BoxesIcon aria-hidden="true" className="text-primary" />
            bulletproof-nextjs
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-2">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href={ROUTES.dashboard}>Dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={ROUTES.login}>Login demo</Link>
            </Button>
            <ThemeSwitcher />
          </nav>
        </div>
      </header>
      <main id="main-content">
        <section className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.25fr_0.75fr] lg:px-8">
          <div className="flex flex-col items-start gap-7">
            <Badge variant="outline">Standalone Next.js 16 shell</Badge>
            <div className="flex flex-col gap-5">
              <p className="blueprint-kicker">
                bulletproof-nextjs / reference build
              </p>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                A precise frame for the application you actually need.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Clear module boundaries, accessible interface states, and an
                honest integration surface—without pretending a backend,
                authentication system, or persistence layer already exists.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild size="lg">
                <Link href={ROUTES.dashboard}>
                  Inspect dashboard
                  <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={ROUTES.login}>Test local validation</Link>
              </Button>
            </div>
          </div>

          <aside
            className="blueprint-panel flex flex-col gap-6 p-6"
            aria-label="Project status"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="blueprint-kicker">System status</p>
                <h2 className="text-xl font-semibold">Frontend baseline</h2>
              </div>
              <CheckCircle2Icon aria-hidden="true" className="text-primary" />
            </div>
            <Separator />
            <dl className="grid gap-5">
              <div className="grid grid-cols-[1fr_auto] gap-4">
                <dt className="text-muted-foreground">Runtime</dt>
                <dd className="font-mono text-sm">Next.js / React</dd>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-4">
                <dt className="text-muted-foreground">Data demo</dt>
                <dd className="font-mono text-sm">Static JSON</dd>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-4">
                <dt className="text-muted-foreground">Authentication</dt>
                <dd className="font-mono text-sm">Not configured</dd>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-4">
                <dt className="text-muted-foreground">Persistence</dt>
                <dd className="font-mono text-sm">Not configured</dd>
              </div>
            </dl>
          </aside>
        </section>

        <section
          className="border-y bg-background"
          aria-labelledby="architecture-title"
        >
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-14 sm:px-6 lg:px-8">
            <div className="flex max-w-2xl flex-col gap-2">
              <p className="blueprint-kicker">Architecture</p>
              <h2
                id="architecture-title"
                className="text-3xl font-semibold tracking-tight"
              >
                Deliberately small boundaries
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {architecture.map(({ description, icon: Icon, title }) => (
                <Card key={title}>
                  <CardHeader>
                    <Icon aria-hidden="true" className="text-primary" />
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="flex flex-col gap-3">
            <DatabaseZapIcon aria-hidden="true" className="text-primary" />
            <p className="blueprint-kicker">Integration boundary</p>
            <h2 className="text-3xl font-semibold tracking-tight">
              No simulated product state
            </h2>
            <p className="max-w-xl leading-7 text-muted-foreground">
              Forms validate locally and say so. The dashboard fetches a checked
              JSON fixture through the real shared HTTP boundary. Add real
              services only when product requirements exist.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Verification commands</CardTitle>
              <CardDescription>
                Narrow checks available from the repository root.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3 font-mono text-sm">
                {commands.map((command) => (
                  <li key={command} className="border-l-2 border-primary pl-3">
                    {command}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
