import path from "node:path";
import { fileURLToPath } from "node:url";
import { clientEnvSchema } from "../src/shared/env/env.schema";

export function validateEnvironment(
  environment: Partial<Record<string, string | undefined>>,
) {
  return clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_NAME: environment["NEXT_PUBLIC_APP_NAME"],
    NEXT_PUBLIC_APP_URL: environment["NEXT_PUBLIC_APP_URL"],
  });
}

function main() {
  const result = validateEnvironment(process.env);

  if (result.success) {
    console.log("Environment check passed.");
    return;
  }

  console.error("Environment validation failed.");
  for (const issue of result.error.issues) {
    console.error(`${issue.path.join(".")}: ${issue.message}`);
  }
  process.exitCode = 1;
}

const entryPath = process.argv[1] ? path.resolve(process.argv[1]) : undefined;
if (entryPath === fileURLToPath(import.meta.url)) {
  main();
}
