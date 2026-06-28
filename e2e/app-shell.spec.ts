import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

async function expectNoSeriousAccessibilityViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
    .analyze();

  expect(results.violations).toEqual([]);
}

function collectBrowserErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });
  return errors;
}

test("home route presents the starter and remains accessible", async ({
  page,
}) => {
  const browserErrors = collectBrowserErrors(page);
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "A precise frame for the application you actually need.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Inspect dashboard" }),
  ).toBeVisible();
  await expect(page.locator("body")).not.toHaveCSS("overflow-x", "scroll");
  await expectNoSeriousAccessibilityViolations(page);
  expect(browserErrors).toEqual([]);
});

test("login validation focuses the first invalid field and reports honest success", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Validate form" }).click();

  const email = page.getByLabel("Email address");
  await expect(email).toBeFocused();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("Correct 2 fields")).toBeVisible();

  await email.fill("person@example.com");
  await page.getByLabel("Password").fill("correct-horse");
  await page.getByRole("button", { name: "Validate form" }).click();
  await expect(
    page.getByText("No authentication request was made"),
  ).toBeVisible();
  await expectNoSeriousAccessibilityViolations(page);
});

test("dashboard loads validated activity and exposes mobile navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/dashboard");

  await expect(
    page.getByRole("heading", { name: "Application baseline" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Application shell initialized" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("dialog", { name: "bulletproof-nextjs navigation" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Settings" }).click();
  await expect(page).toHaveURL(/\/settings$/u);
  await expect(
    page.getByRole("dialog", { name: "bulletproof-nextjs navigation" }),
  ).toBeHidden();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await expectNoSeriousAccessibilityViolations(page);
});

test("dashboard renders empty and recoverable error states", async ({
  page,
}) => {
  await page.route("**/demo/activity.json", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ items: [] }),
    });
  });
  await page.goto("/dashboard");
  await expect(page.getByText("No activity yet")).toBeVisible();

  await page.unroute("**/demo/activity.json");
  await page.route("**/demo/activity.json", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ message: "Unavailable" }),
    });
  });
  await page.reload();
  await expect(page.getByText("Activity could not be loaded")).toBeVisible();
  await expect(page.getByText("Request failed", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Retry" })).toBeVisible();
});

test("settings validates locally and applies a persistent dark theme", async ({
  page,
}) => {
  await page.goto("/settings");
  await page.getByLabel("Display name").fill("");
  await page.getByRole("button", { name: "Validate preferences" }).click();
  await expect(page.getByLabel("Display name")).toBeFocused();

  await page.getByLabel("Display name").fill("bulletproof-nextjs Operator");
  await page.getByRole("combobox", { name: "Theme" }).click();
  await page.getByRole("option", { name: "Dark" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Validate preferences" }).click();
  await expect(page.getByText("Profile values were not sent")).toBeVisible();

  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expectNoSeriousAccessibilityViolations(page);
});

test("unknown routes render the custom not-found recovery", async ({
  page,
}) => {
  await page.goto("/missing-route");
  await expect(
    page.getByRole("heading", { name: "This frame is not in the plan" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Return home" })).toBeVisible();
});
