"use client";

import { rootFontClassName } from "@/app/fonts";
import "./globals.css";

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en" className={rootFontClassName}>
      <body>
        <title>Application error · bulletproof-nextjs</title>
        <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-16">
          <section className="blueprint-panel flex w-full flex-col gap-5 p-8">
            <p className="blueprint-kicker">Global boundary</p>
            <h1 className="text-3xl font-semibold tracking-tight">
              bulletproof-nextjs could not start
            </h1>
            <p className="text-muted-foreground">
              Reload the application shell to attempt a clean render.
            </p>
            <button
              className="min-h-11 w-fit rounded-md bg-primary px-4 font-medium text-primary-foreground"
              type="button"
              onClick={unstable_retry}
            >
              Reload shell
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
