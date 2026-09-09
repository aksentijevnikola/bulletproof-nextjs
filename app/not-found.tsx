import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/shared/routes";
import { Button } from "@/shared/ui";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-16"
    >
      <section className="blueprint-panel flex w-full flex-col items-start gap-5 p-6 sm:p-10">
        <p className="blueprint-kicker">404 / route missing</p>
        <h1 className="text-4xl font-semibold tracking-tight">
          This frame is not in the plan
        </h1>
        <p className="max-w-xl text-muted-foreground">
          The requested route does not exist in this standalone shell.
        </p>
        <Button asChild>
          <Link href={ROUTES.home}>
            <ArrowLeftIcon data-icon="inline-start" aria-hidden="true" />
            Return home
          </Link>
        </Button>
      </section>
    </main>
  );
}
