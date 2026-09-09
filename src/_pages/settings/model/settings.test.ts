import { describe, expect, test } from "vitest";
import { settingsSchema } from "./settings";

describe("settingsSchema", () => {
  test("accepts valid preferences", () => {
    expect(
      settingsSchema.safeParse({
        displayName: "bulletproof-nextjs Operator",
        email: "operator@example.com",
        timezone: "Europe/Skopje",
        theme: "system",
      }).success,
    ).toBe(true);
  });

  test("rejects an unsupported theme", () => {
    const result = settingsSchema.safeParse({
      displayName: "bulletproof-nextjs Operator",
      email: "operator@example.com",
      timezone: "Europe/Skopje",
      theme: "blue",
    });

    expect(result.success).toBe(false);
  });
});
