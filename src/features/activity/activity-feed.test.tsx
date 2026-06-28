import userEvent from "@testing-library/user-event";
import { delay, HttpResponse, http } from "msw";
import { beforeEach, describe, expect, test } from "vitest";
import { ActivityFeed } from "@/features/activity/activity-feed";
import { server } from "@/test/mocks/server";
import { renderWithProviders, screen, waitFor } from "@/test/test-utils";

const activityUrl = "*/demo/activity.json";

const populatedResponse = {
  items: [
    {
      id: "activity-test",
      title: "Validated fixture loaded",
      description: "The response passed its schema.",
      occurredAt: "2026-06-25T08:00:00.000Z",
      status: "success",
    },
  ],
};

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
});

describe("ActivityFeed", () => {
  test("renders a loading state before the request completes", async () => {
    server.use(
      http.get(activityUrl, async () => {
        await delay(100);
        return HttpResponse.json(populatedResponse);
      }),
    );

    renderWithProviders(<ActivityFeed />);

    expect(screen.getByLabelText("Loading activity")).toBeInTheDocument();
    expect(
      await screen.findByText("Validated fixture loaded"),
    ).toBeInTheDocument();
  });

  test("renders validated activity items", async () => {
    server.use(
      http.get(activityUrl, () => HttpResponse.json(populatedResponse)),
    );

    renderWithProviders(<ActivityFeed />);

    expect(
      await screen.findByText("Validated fixture loaded"),
    ).toBeInTheDocument();
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });

  test("renders an empty state for a valid empty list", async () => {
    server.use(http.get(activityUrl, () => HttpResponse.json({ items: [] })));

    renderWithProviders(<ActivityFeed />);

    expect(await screen.findByText("No activity yet")).toBeInTheDocument();
  });

  test("renders an error when response validation fails", async () => {
    server.use(
      http.get(activityUrl, () =>
        HttpResponse.json({ items: [{ id: "missing-fields" }] }),
      ),
    );

    renderWithProviders(<ActivityFeed />);

    expect(
      await screen.findByText("Activity could not be loaded"),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Activity could not be loaded",
    );
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  test("retries a failed request", async () => {
    let requestCount = 0;
    server.use(
      http.get(activityUrl, () => {
        requestCount += 1;
        return requestCount === 1
          ? new HttpResponse(null, { status: 500 })
          : HttpResponse.json(populatedResponse);
      }),
    );
    const user = userEvent.setup();
    renderWithProviders(<ActivityFeed />);

    await user.click(await screen.findByRole("button", { name: "Retry" }));

    await waitFor(() => {
      expect(screen.getByText("Validated fixture loaded")).toBeInTheDocument();
    });
    expect(requestCount).toBe(2);
  });
});
