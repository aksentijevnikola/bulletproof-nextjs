import { describe, expect, test } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  test("merges conditional and conflicting Tailwind classes", () => {
    expect(cn("px-2", false, "px-4")).toBe("px-4");
  });
});
