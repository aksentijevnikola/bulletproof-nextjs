import { describe, expect, test } from "vitest";
import { activityQueries } from "./activity.queries";

describe("activityQueries", () => {
  test("defines the stable activity query options", () => {
    const options = activityQueries.activity();

    expect(options.queryKey).toEqual(["demo", "activity"]);
    expect(options.retry).toBe(false);
  });
});
