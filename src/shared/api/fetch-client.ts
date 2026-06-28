import { createApiError } from "@/shared/api/api-error";
import type { ApiResult } from "@/shared/api/api-result";
import { parseApiResponse } from "@/shared/api/parse-api-response";
import type { FetchClientOptions } from "@/shared/api/request-options";

const DEFAULT_TIMEOUT_MS = 10_000;

function resolveRequestUrl(input: string | URL, baseUrl?: string) {
  if (input instanceof URL || baseUrl === undefined) {
    return input;
  }

  return new URL(input, baseUrl);
}

function createRequestBody(
  headers: Headers,
  body: BodyInit | undefined,
  json: unknown,
) {
  if (body !== undefined && json !== undefined) {
    throw new TypeError("Provide either body or json, not both.");
  }

  if (json === undefined) {
    return body;
  }

  if (!headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  return JSON.stringify(json);
}

export async function fetchClient<T>(
  input: string | URL,
  options: FetchClientOptions<T> = {},
): Promise<ApiResult<T>> {
  const {
    baseUrl,
    body,
    headers: initialHeaders,
    json,
    schema,
    signal: externalSignal,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    ...requestInit
  } = options;
  const timeoutController = new AbortController();
  const timeoutId =
    timeoutMs > 0
      ? setTimeout(() => {
          timeoutController.abort();
        }, timeoutMs)
      : undefined;

  try {
    const headers = new Headers(initialHeaders);
    const requestBody = createRequestBody(headers, body, json);
    const signal = externalSignal
      ? AbortSignal.any([externalSignal, timeoutController.signal])
      : timeoutController.signal;
    const requestOptions: RequestInit = {
      ...requestInit,
      headers,
      signal,
      ...(requestBody === undefined ? {} : { body: requestBody }),
    };
    const response = await fetch(
      resolveRequestUrl(input, baseUrl),
      requestOptions,
    );

    return await parseApiResponse(response, schema);
  } catch (error) {
    if (timeoutController.signal.aborted && !externalSignal?.aborted) {
      return {
        ok: false,
        status: 0,
        error: createApiError("timeout", "The request timed out."),
      };
    }

    if (
      externalSignal?.aborted ||
      (error instanceof DOMException && error.name === "AbortError")
    ) {
      return {
        ok: false,
        status: 0,
        error: createApiError("aborted", "The request was aborted."),
      };
    }

    if (error instanceof TypeError) {
      return {
        ok: false,
        status: 0,
        error: createApiError("network_error", "The network request failed."),
      };
    }

    return {
      ok: false,
      status: 0,
      error: createApiError("unknown", "An unexpected request error occurred."),
    };
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }
}
