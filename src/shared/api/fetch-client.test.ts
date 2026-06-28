import { delay, HttpResponse, http } from "msw";
import { describe, expect, test } from "vitest";
import { z } from "zod";
import { server } from "@/test/mocks/server";
import { fetchClient } from "./fetch-client";

const apiUrl = "https://api.example.test";
const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
});

describe("fetchClient", () => {
  test("returns validated JSON data", async () => {
    server.use(
      http.get(`${apiUrl}/items/1`, () =>
        HttpResponse.json({ id: "1", name: "Example" }),
      ),
    );

    const result = await fetchClient("/items/1", {
      baseUrl: apiUrl,
      schema: itemSchema,
    });

    expect(result).toEqual({
      ok: true,
      data: { id: "1", name: "Example" },
      status: 200,
    });
  });

  test("serializes JSON request bodies", async () => {
    server.use(
      http.post(`${apiUrl}/items`, async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json(body, { status: 201 });
      }),
    );

    const result = await fetchClient(`${apiUrl}/items`, {
      method: "POST",
      json: { id: "2", name: "Created" },
      schema: itemSchema,
    });

    expect(result).toEqual({
      ok: true,
      data: { id: "2", name: "Created" },
      status: 201,
    });
  });

  test("normalizes malformed JSON", async () => {
    server.use(
      http.get(
        `${apiUrl}/malformed`,
        () =>
          new HttpResponse("{", {
            headers: { "content-type": "application/json" },
          }),
      ),
    );

    const result = await fetchClient(`${apiUrl}/malformed`, {
      schema: itemSchema,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_response");
    }
  });

  test("normalizes schema-invalid responses", async () => {
    server.use(
      http.get(`${apiUrl}/invalid`, () => HttpResponse.json({ id: 1 })),
    );

    const result = await fetchClient(`${apiUrl}/invalid`, {
      schema: itemSchema,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_response");
      expect(result.error.details?.["issues"]).toBeDefined();
    }
  });

  test("supports empty successful responses", async () => {
    server.use(
      http.delete(
        `${apiUrl}/items/1`,
        () => new HttpResponse(null, { status: 204 }),
      ),
    );

    const result = await fetchClient<undefined>(`${apiUrl}/items/1`, {
      method: "DELETE",
    });

    expect(result).toEqual({
      ok: true,
      data: undefined,
      status: 204,
    });
  });

  test("supports non-JSON responses", async () => {
    server.use(
      http.get(`${apiUrl}/health`, () =>
        HttpResponse.text("healthy", { status: 200 }),
      ),
    );

    const result = await fetchClient<string>(`${apiUrl}/health`);

    expect(result).toEqual({
      ok: true,
      data: "healthy",
      status: 200,
    });
  });

  test("normalizes HTTP errors without exposing response bodies", async () => {
    server.use(
      http.get(`${apiUrl}/private`, () =>
        HttpResponse.json(
          { message: "Sensitive internal detail" },
          { status: 403 },
        ),
      ),
    );

    const result = await fetchClient(`${apiUrl}/private`);

    expect(result).toEqual({
      ok: false,
      status: 403,
      error: {
        code: "http_error",
        message: "Request failed with status 403.",
        status: 403,
      },
    });
  });

  test("normalizes network failures", async () => {
    server.use(http.get(`${apiUrl}/offline`, () => HttpResponse.error()));

    const result = await fetchClient(`${apiUrl}/offline`);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("network_error");
    }
  });

  test("normalizes caller aborts", async () => {
    server.use(
      http.get(`${apiUrl}/slow`, async () => {
        await delay("infinite");
        return HttpResponse.json({ id: "1", name: "Slow" });
      }),
    );
    const controller = new AbortController();
    controller.abort();

    const result = await fetchClient(`${apiUrl}/slow`, {
      signal: controller.signal,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("aborted");
    }
  });

  test("normalizes timeouts", async () => {
    server.use(
      http.get(`${apiUrl}/timeout`, async () => {
        await delay("infinite");
        return HttpResponse.json({ id: "1", name: "Slow" });
      }),
    );

    const result = await fetchClient(`${apiUrl}/timeout`, {
      timeoutMs: 5,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("timeout");
    }
  });
});
