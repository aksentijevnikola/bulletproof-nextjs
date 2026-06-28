import { describe, expect, test } from "vitest";
import { validateEnvironment } from "./check-env";

describe("validateEnvironment", () => {
  test("applies safe local defaults", () => {
    const result = validateEnvironment({});

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        NEXT_PUBLIC_APP_NAME: "bulletproof-nextjs",
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      });
    }
  });

  test("rejects an invalid public application URL", () => {
    const result = validateEnvironment({
      NEXT_PUBLIC_APP_URL: "not-a-url",
    });

    expect(result.success).toBe(false);
  });
});
