import { describe, expect, test } from "vitest";
import { loginSchema } from "@/features/auth/login-schema";

describe("loginSchema", () => {
  test("accepts a valid local login shape", () => {
    expect(
      loginSchema.safeParse({
        email: "dev@example.com",
        password: "eight-plus",
      }).success,
    ).toBe(true);
  });

  test("rejects malformed credentials", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "short",
    });

    expect(result.success).toBe(false);
  });
});
