import { describe, expect, test } from "vitest";
import { z } from "zod";
import { parseApiResponse } from "./parse-api-response";

describe("parseApiResponse", () => {
  test("parses a typed JSON response", async () => {
    const result = await parseApiResponse(
      Response.json({ value: 42 }),
      z.object({ value: z.number() }),
    );

    expect(result).toEqual({
      ok: true,
      data: { value: 42 },
      status: 200,
    });
  });
});
