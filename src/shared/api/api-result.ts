import type { ApiError } from "@/shared/api/api-error";

export type ApiResult<T> =
  | {
      ok: true;
      data: T;
      status: number;
    }
  | {
      ok: false;
      error: ApiError;
      status: number;
    };
