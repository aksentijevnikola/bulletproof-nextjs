import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

type PackageManifest = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

const forbiddenPackages = new Set([
  "axios",
  "jotai",
  "next-pwa",
  "recoil",
  "redux",
  "turbo",
  "turborepo",
  "zustand",
]);

const forbiddenPackagePrefixes = ["@nx/", "@reduxjs/"];

function hasPrereleaseIdentifier(version: string) {
  const normalizedVersion = version.replace(/^[~^<>=\s]*/u, "");
  return /^\d+\.\d+\.\d+-[0-9A-Za-z]/u.test(normalizedVersion);
}

export function validateDependencies(
  manifest: PackageManifest,
  lockfileExists: boolean,
) {
  const violations: string[] = [];
  const dependencies = {
    ...manifest.dependencies,
    ...manifest.devDependencies,
  };

  if (!lockfileExists) {
    violations.push("bun.lock is required.");
  }

  for (const [packageName, version] of Object.entries(dependencies)) {
    if (
      forbiddenPackages.has(packageName) ||
      forbiddenPackagePrefixes.some((prefix) => packageName.startsWith(prefix))
    ) {
      violations.push(`${packageName} is prohibited by the project baseline.`);
    }

    if (hasPrereleaseIdentifier(version)) {
      violations.push(`${packageName}@${version} is a prerelease dependency.`);
    }
  }

  const reactVersion = manifest.dependencies?.["react"];
  const reactDomVersion = manifest.dependencies?.["react-dom"];
  if (reactVersion !== reactDomVersion) {
    violations.push("react and react-dom must use the same version.");
  }

  const vitestVersion = manifest.devDependencies?.["vitest"];
  const coverageVersion = manifest.devDependencies?.["@vitest/coverage-v8"];
  if (vitestVersion !== coverageVersion) {
    violations.push(
      "vitest and @vitest/coverage-v8 must use the same version.",
    );
  }

  const queryVersion = manifest.dependencies?.["@tanstack/react-query"];
  const devtoolsVersion =
    manifest.devDependencies?.["@tanstack/react-query-devtools"];
  if (queryVersion !== devtoolsVersion) {
    violations.push(
      "@tanstack/react-query and @tanstack/react-query-devtools must use the same version.",
    );
  }

  return violations;
}

async function pathExists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function checkDependencies(rootDirectory = process.cwd()) {
  const packageJsonPath = path.join(rootDirectory, "package.json");
  const manifest = JSON.parse(
    await readFile(packageJsonPath, "utf8"),
  ) as PackageManifest;
  return validateDependencies(
    manifest,
    await pathExists(path.join(rootDirectory, "bun.lock")),
  );
}

async function main() {
  const violations = await checkDependencies();

  if (violations.length === 0) {
    console.log("Dependency check passed.");
    return;
  }

  for (const violation of violations) {
    console.error(violation);
  }

  process.exitCode = 1;
}

const entryPath = process.argv[1] ? path.resolve(process.argv[1]) : undefined;
if (entryPath === fileURLToPath(import.meta.url)) {
  await main();
}
