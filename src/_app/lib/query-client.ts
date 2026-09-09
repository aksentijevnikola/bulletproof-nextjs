import {
  environmentManager,
  MutationCache,
  QueryCache,
  QueryClient,
  type QueryClientConfig,
} from "@tanstack/react-query";

export type AsyncErrorReport = {
  error: unknown;
  queryKey?: readonly unknown[];
  mutationKey?: readonly unknown[];
  source: "query" | "mutation";
};

export type CreateQueryClientConfig = QueryClientConfig & {
  onAsyncError?: (report: AsyncErrorReport) => void;
};

export function createQueryClient(config?: CreateQueryClientConfig) {
  const { onAsyncError, ...queryClientConfig } = config ?? {};

  return new QueryClient({
    ...queryClientConfig,
    mutationCache:
      queryClientConfig.mutationCache ??
      new MutationCache({
        onError: (error, _variables, _onMutateResult, mutation) => {
          const { mutationKey } = mutation.options;

          onAsyncError?.({
            error,
            ...(mutationKey ? { mutationKey } : {}),
            source: "mutation",
          });
        },
      }),
    queryCache:
      queryClientConfig.queryCache ??
      new QueryCache({
        onError: (error, query) => {
          onAsyncError?.({
            error,
            queryKey: query.queryKey,
            source: "query",
          });
        },
      }),
    defaultOptions: {
      ...queryClientConfig.defaultOptions,
      queries: {
        staleTime: 60_000,
        ...queryClientConfig.defaultOptions?.queries,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (environmentManager.isServer()) {
    return createQueryClient();
  }

  browserQueryClient ??= createQueryClient();

  return browserQueryClient;
}
