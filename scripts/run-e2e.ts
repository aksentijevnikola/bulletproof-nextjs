const baseUrl = "http://127.0.0.1:3000";
const usesExternalServer = process.env["PLAYWRIGHT_EXTERNAL_SERVER"] === "1";

async function isServerReady() {
  try {
    const response = await fetch(baseUrl, {
      signal: AbortSignal.timeout(1000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (await isServerReady()) {
      return;
    }
    await Bun.sleep(500);
  }

  throw new Error("Production server did not become ready.");
}

async function runPlaywright() {
  const child = Bun.spawn(
    [
      "node",
      "./node_modules/@playwright/test/cli.js",
      "test",
      "--reporter=line",
    ],
    {
      env: {
        ...process.env,
        PLAYWRIGHT_EXTERNAL_SERVER: "1",
      },
      stdout: "inherit",
      stderr: "inherit",
    },
  );

  const exitCode = await child.exited;
  if (exitCode !== 0) {
    process.exitCode = exitCode;
  }
}

async function main() {
  if (usesExternalServer) {
    await waitForServer();
    await runPlaywright();
    return;
  }

  if (await isServerReady()) {
    throw new Error(
      "Port 3000 is already serving an application. Stop it before running managed E2E, or set PLAYWRIGHT_EXTERNAL_SERVER=1 to test an external server intentionally.",
    );
  }

  const server = Bun.spawn(
    [
      "node",
      "./node_modules/next/dist/bin/next",
      "start",
      "-H",
      "127.0.0.1",
      "-p",
      "3000",
    ],
    {
      env: {
        ...process.env,
        NEXT_PUBLIC_APP_NAME: "bulletproof-nextjs",
        NEXT_PUBLIC_APP_URL: baseUrl,
      },
      stdout: "inherit",
      stderr: "inherit",
    },
  );

  try {
    await waitForServer();
    await runPlaywright();
  } finally {
    server.kill();
    await server.exited.catch(() => undefined);
  }
}

await main();

export {};
