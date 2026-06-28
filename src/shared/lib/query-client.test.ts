import { describe, expect, test, vi } from "vitest";
import { createQueryClient } from "./query-client";

describe("createQueryClient", () => {
  test("creates isolated clients with the application stale time", () => {
    const firstClient = createQueryClient();
    const secondClient = createQueryClient();

    expect(firstClient).not.toBe(secondClient);
    expect(firstClient.getDefaultOptions().queries?.staleTime).toBe(60_000);
  });

  test("reports query errors through the global error callback", async () => {
    const onAsyncError = vi.fn();
    const error = new Error("Query failed");
    const queryClient = createQueryClient({ onAsyncError });

    await expect(
      queryClient.fetchQuery({
        queryFn: async () => {
          throw error;
        },
        queryKey: ["demo", "query-error"],
        retry: false,
      }),
    ).rejects.toThrow("Query failed");

    expect(onAsyncError).toHaveBeenCalledWith({
      error,
      queryKey: ["demo", "query-error"],
      source: "query",
    });
  });

  test("reports mutation errors through the global error callback", async () => {
    const onAsyncError = vi.fn();
    const error = new Error("Mutation failed");
    const queryClient = createQueryClient({ onAsyncError });
    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationFn: async () => {
        throw error;
      },
      mutationKey: ["demo", "mutation-error"],
      retry: false,
    });

    await expect(mutation.execute(undefined)).rejects.toThrow(
      "Mutation failed",
    );

    expect(onAsyncError).toHaveBeenCalledWith({
      error,
      mutationKey: ["demo", "mutation-error"],
      source: "mutation",
    });
  });
});
