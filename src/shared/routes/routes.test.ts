import { describe, expect, test } from "vitest";
import { ROUTES } from "./routes";

describe("ROUTES", () => {
  test("defines the approved application routes", () => {
    expect(ROUTES).toEqual({
      home: "/",
      login: "/login",
      dashboard: "/dashboard",
      settings: "/settings",
    });
  });
});
