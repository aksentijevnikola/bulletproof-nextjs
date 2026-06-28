import type { z } from "zod";

export type FetchClientOptions<T> = Omit<RequestInit, "body" | "signal"> & {
  baseUrl?: string;
  body?: BodyInit;
  json?: unknown;
  schema?: z.ZodType<T>;
  signal?: AbortSignal;
  timeoutMs?: number;
};
