"use client";

import { AlertTriangleIcon, RotateCcwIcon } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/shared/ui/button";

export default function ErrorBoundary({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-16"
    >
      <section className="blueprint-panel flex w-full flex-col items-start gap-5 p-6 sm:p-10">
        <AlertTriangleIcon aria-hidden="true" className="text-destructive" />
        <div className="flex flex-col gap-2">
          <p className="blueprint-kicker">Runtime boundary</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            This view could not be rendered
          </h1>
          <p className="max-w-xl text-muted-foreground">
            The failure was contained. Retry the route; no form data or backend
            state is involved in this starter.
          </p>
        </div>
        <Button type="button" onClick={unstable_retry}>
          <RotateCcwIcon data-icon="inline-start" aria-hidden="true" />
          Try again
        </Button>
      </section>
    </main>
  );
}
