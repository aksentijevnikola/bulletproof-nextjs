import { HttpResponse, http } from "msw";
import { describe, expect, test } from "vitest";
import { server } from "@/test/mocks/server";
import { getActivity } from "./get-activity";

const activityUrl = "*/demo/activity.json";

describe("getActivity", () => {
  test("returns validated activity data", async () => {
    server.use(
      http.get(activityUrl, () =>
        HttpResponse.json({
          items: [
            {
              id: "activity-test",
              title: "Validated fixture loaded",
              description: "The response passed its schema.",
              occurredAt: "2026-06-25T08:00:00.000Z",
              status: "success",
            },
          ],
        }),
      ),
    );

    await expect(getActivity(new AbortController().signal)).resolves.toEqual({
      items: [
        {
          id: "activity-test",
          title: "Validated fixture loaded",
          description: "The response passed its schema.",
          occurredAt: "2026-06-25T08:00:00.000Z",
          status: "success",
        },
      ],
    });
  });

  test("throws a normalized UI-safe error for unsuccessful responses", async () => {
    server.use(
      http.get(activityUrl, () => new HttpResponse(null, { status: 500 })),
    );

    await expect(getActivity(new AbortController().signal)).rejects.toThrow(
      "Request failed with status 500.",
    );
  });

  test("forwards request cancellation", async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(getActivity(controller.signal)).rejects.toThrow(
      "The request was aborted.",
    );
  });
});
