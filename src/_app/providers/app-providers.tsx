"use client";

import type { ReactNode } from "react";
import { Toaster } from "@/shared/ui";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>{children}</QueryProvider>
      <Toaster closeButton position="bottom-right" richColors />
    </ThemeProvider>
  );
}
