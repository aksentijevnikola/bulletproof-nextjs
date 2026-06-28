import { useQueryClient } from "@tanstack/react-query";
import { describe, expect, test } from "vitest";
import { AppProviders } from "@/shared/providers/app-providers";
import { render, screen } from "@/test/test-utils";

function QueryClientProbe() {
  const queryClient = useQueryClient();
  const staleTime = queryClient.getDefaultOptions().queries?.staleTime;

  return (
    <output aria-label="query stale time">
      {typeof staleTime === "function" ? "dynamic" : staleTime}
    </output>
  );
}

describe("AppProviders", () => {
  test("composes theme and query providers globally", () => {
    render(
      <AppProviders>
        <QueryClientProbe />
      </AppProviders>,
    );

    expect(screen.getByLabelText("query stale time")).toHaveTextContent(
      "60000",
    );
  });
});
