import { QueryClientProvider } from "@tanstack/react-query";
import {
  type RenderOptions,
  type RenderResult,
  render,
} from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { createQueryClient } from "@/_app/lib";
import { ThemeProvider } from "@/_app/providers";

export function createTestQueryClient() {
  return createQueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
      queries: {
        gcTime: Number.POSITIVE_INFINITY,
        retry: false,
        staleTime: 0,
      },
    },
  });
}

type CustomRenderResult = RenderResult & {
  queryClient: ReturnType<typeof createTestQueryClient>;
};

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
): CustomRenderResult {
  const queryClient = createTestQueryClient();

  function Providers({ children }: { children: ReactNode }) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Providers, ...options }),
    queryClient,
  };
}

export * from "@testing-library/react";
