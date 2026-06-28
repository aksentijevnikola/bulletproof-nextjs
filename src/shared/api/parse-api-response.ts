import type { z } from "zod";
import { createApiError } from "@/shared/api/api-error";
import type { ApiResult } from "@/shared/api/api-result";

function isJsonResponse(response: Response) {
  return (
    response.headers.get("content-type")?.includes("application/json") ?? false
  );
}

function formatValidationIssues(error: z.ZodError) {
  return error.issues.map((issue) => ({
    code: issue.code,
    message: issue.message,
    path: issue.path.map(String).join("."),
  }));
}

export async function parseApiResponse<T>(
  response: Response,
  schema?: z.ZodType<T>,
): Promise<ApiResult<T>> {
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: createApiError(
        "http_error",
        `Request failed with status ${response.status}.`,
        { status: response.status },
      ),
    };
  }

  const responseText = await response.text();
  let payload: unknown;

  if (responseText.length === 0) {
    payload = undefined;
  } else if (isJsonResponse(response)) {
    try {
      payload = JSON.parse(responseText) as unknown;
    } catch {
      return {
        ok: false,
        status: response.status,
        error: createApiError(
          "invalid_response",
          "The server returned malformed JSON.",
          { status: response.status },
        ),
      };
    }
  } else {
    payload = responseText;
  }

  if (schema) {
    const parsed = schema.safeParse(payload);

    if (!parsed.success) {
      return {
        ok: false,
        status: response.status,
        error: createApiError(
          "invalid_response",
          "The server response did not match the expected format.",
          {
            status: response.status,
            details: {
              issues: formatValidationIssues(parsed.error),
            },
          },
        ),
      };
    }

    return {
      ok: true,
      data: parsed.data,
      status: response.status,
    };
  }

  return {
    ok: true,
    data: payload as T,
    status: response.status,
  };
}
