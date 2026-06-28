"use client";

import { toast } from "sonner";

export type AsyncErrorSource = "query" | "mutation";

export type NotifyAsyncErrorInput = {
  error: unknown;
  source: AsyncErrorSource;
};

export function getAsyncErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return "An unexpected problem occurred. Please try again.";
}

export function getAsyncErrorTitle(source: AsyncErrorSource) {
  return source === "mutation" ? "Update failed" : "Request failed";
}

export function notifyAsyncError({ error, source }: NotifyAsyncErrorInput) {
  toast.error(getAsyncErrorTitle(source), {
    description: getAsyncErrorMessage(error),
  });
}
