import { defineConfig, devices } from "@playwright/test";

const port = 3000;
const baseURL = `http://127.0.0.1:${port}`;
const isCI = Boolean(process.env["CI"]);
const usesExternalServer = process.env["PLAYWRIGHT_EXTERNAL_SERVER"] === "1";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: 2,
  reporter: isCI
    ? [["html", { open: "never" }], ["github"]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  ...(usesExternalServer
    ? {}
    : {
        webServer: {
          command:
            "node ./node_modules/next/dist/bin/next start -H 127.0.0.1 -p 3000",
          url: baseURL,
          reuseExistingServer: !isCI,
          timeout: 120_000,
          env: {
            NEXT_PUBLIC_APP_NAME: "bulletproof-nextjs",
            NEXT_PUBLIC_APP_URL: baseURL,
          },
        },
      }),
});
