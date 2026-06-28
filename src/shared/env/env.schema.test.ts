import { describe, expect, test } from "vitest";
import { clientEnvSchema } from "./env.schema";

describe("clientEnvSchema", () => {
  test("trims the application name and accepts an absolute URL", () => {
    expect(
      clientEnvSchema.parse({
        NEXT_PUBLIC_APP_NAME: "  bulletproof-nextjs  ",
        NEXT_PUBLIC_APP_URL: "https://example.com",
      }),
    ).toEqual({
      NEXT_PUBLIC_APP_NAME: "bulletproof-nextjs",
      NEXT_PUBLIC_APP_URL: "https://example.com",
    });
  });
});
