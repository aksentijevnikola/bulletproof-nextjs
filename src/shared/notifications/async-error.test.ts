import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  getAsyncErrorMessage,
  getAsyncErrorTitle,
  notifyAsyncError,
} from "@/shared/notifications/async-error";

const { toastError } = vi.hoisted(() => ({
  toastError: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: toastError,
  },
}));

describe("async error notifications", () => {
  beforeEach(() => {
    toastError.mockClear();
  });

  test("normalizes unknown error messages", () => {
    expect(getAsyncErrorMessage(new Error("Network unavailable"))).toBe(
      "Network unavailable",
    );
    expect(getAsyncErrorMessage("Request timed out")).toBe("Request timed out");
    expect(getAsyncErrorMessage(null)).toBe(
      "An unexpected problem occurred. Please try again.",
    );
  });

  test("uses query and mutation specific titles", () => {
    expect(getAsyncErrorTitle("query")).toBe("Request failed");
    expect(getAsyncErrorTitle("mutation")).toBe("Update failed");
  });

  test("sends normalized errors to the global toaster", () => {
    notifyAsyncError({
      error: new Error("Fixture failed validation"),
      source: "query",
    });

    expect(toastError).toHaveBeenCalledWith("Request failed", {
      description: "Fixture failed validation",
    });
  });
});
