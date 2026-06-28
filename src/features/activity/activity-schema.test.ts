import { describe, expect, test } from "vitest";
import { activityResponseSchema } from "@/features/activity/activity-schema";

describe("activityResponseSchema", () => {
  test("accepts a populated activity response", () => {
    expect(
      activityResponseSchema.safeParse({
        items: [
          {
            id: "activity-1",
            title: "Ready",
            description: "Validated",
            occurredAt: "2026-06-25T08:00:00.000Z",
            status: "info",
          },
        ],
      }).success,
    ).toBe(true);
  });

  test("rejects malformed activity data", () => {
    expect(
      activityResponseSchema.safeParse({
        items: [{ id: "activity-1" }],
      }).success,
    ).toBe(false);
  });
});
