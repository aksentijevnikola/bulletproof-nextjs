export type ApiErrorCode =
  | "network_error"
  | "timeout"
  | "aborted"
  | "invalid_response"
  | "http_error"
  | "unknown";

export type ApiError = {
  code: ApiErrorCode;
  message: string;
  status?: number;
  details?: Record<string, unknown>;
};

export function createApiError(
  code: ApiErrorCode,
  message: string,
  options: {
    status?: number;
    details?: Record<string, unknown>;
  } = {},
): ApiError {
  return {
    code,
    message,
    ...(options.status === undefined ? {} : { status: options.status }),
    ...(options.details === undefined ? {} : { details: options.details }),
  };
}
