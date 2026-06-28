"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useState } from "react";
import { createQueryClient } from "@/shared/lib/query-client";
import { notifyAsyncError } from "@/shared/notifications/async-error";

const ReactQueryDevtools =
  process.env.NODE_ENV === "development"
    ? dynamic(
        () =>
          import("@tanstack/react-query-devtools").then(
            (module) => module.ReactQueryDevtools,
          ),
        { ssr: false },
      )
    : null;

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() =>
    createQueryClient({
      onAsyncError: ({ error, source }) => {
        notifyAsyncError({ error, source });
      },
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {ReactQueryDevtools ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}
