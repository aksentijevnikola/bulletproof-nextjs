import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

type Layer = "app" | "features" | "shared" | "widgets" | "other";

export type ArchitectureViolation = {
  file: string;
  importedPath: string;
  rule: string;
};

export type SourceFile = {
  filePath: string;
  source: string;
};

const importPattern =
  /(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g;
const dynamicImportPattern = /import\s*\(\s*["']([^"']+)["']\s*\)/g;
const sourceExtensions = new Set([".ts", ".tsx"]);

function normalizePath(filePath: string) {
  return filePath.replaceAll("\\", "/");
}

function getLayer(filePath: string, sourceRoot: string): Layer {
  const relativePath = normalizePath(path.relative(sourceRoot, filePath));
  if (relativePath.includes(".test.") || relativePath.startsWith("test/")) {
    return "other";
  }

  const [topLevelDirectory] = relativePath.split("/");

  if (
    topLevelDirectory === "app" ||
    topLevelDirectory === "features" ||
    topLevelDirectory === "shared" ||
    topLevelDirectory === "widgets"
  ) {
    return topLevelDirectory;
  }

  return "other";
}

function getModuleScope(filePath: string, sourceRoot: string) {
  const relativePath = normalizePath(path.relative(sourceRoot, filePath));
  return relativePath.split("/")[1];
}

function extractImports(source: string) {
  const imports = new Set<string>();

  for (const pattern of [importPattern, dynamicImportPattern]) {
    pattern.lastIndex = 0;
    let match = pattern.exec(source);

    while (match) {
      const importedPath = match[1];
      if (importedPath) {
        imports.add(importedPath);
      }
      match = pattern.exec(source);
    }
  }

  return [...imports];
}

function resolveInternalImport(
  importedPath: string,
  sourceFilePath: string,
  sourceRoot: string,
) {
  if (importedPath.startsWith("@/")) {
    return path.resolve(sourceRoot, importedPath.slice(2));
  }

  if (importedPath.startsWith(".")) {
    return path.resolve(path.dirname(sourceFilePath), importedPath);
  }

  return undefined;
}

function isClientModule(source: string) {
  return /^\s*["']use client["'];?/u.test(source);
}

function isServerOnlyImport(importedPath: string, resolvedPath?: string) {
  if (importedPath === "server-only") {
    return true;
  }

  const normalizedPath = resolvedPath ? normalizePath(resolvedPath) : "";
  return (
    normalizedPath.includes("/server/") ||
    normalizedPath.endsWith(".server") ||
    normalizedPath.endsWith(".server.ts") ||
    normalizedPath.endsWith(".server.tsx")
  );
}

export function analyzeArchitecture(
  files: SourceFile[],
  sourceRoot: string,
): ArchitectureViolation[] {
  const violations: ArchitectureViolation[] = [];

  for (const file of files) {
    const sourceLayer = getLayer(file.filePath, sourceRoot);
    const sourceScope = getModuleScope(file.filePath, sourceRoot);

    for (const importedPath of extractImports(file.source)) {
      const resolvedPath = resolveInternalImport(
        importedPath,
        file.filePath,
        sourceRoot,
      );

      if (
        isClientModule(file.source) &&
        isServerOnlyImport(importedPath, resolvedPath)
      ) {
        violations.push({
          file: file.filePath,
          importedPath,
          rule: "Client modules cannot import server-only modules.",
        });
      }

      if (!resolvedPath) {
        continue;
      }

      const targetLayer = getLayer(resolvedPath, sourceRoot);
      const targetScope = getModuleScope(resolvedPath, sourceRoot);

      if (sourceLayer !== "app" && targetLayer === "app") {
        violations.push({
          file: file.filePath,
          importedPath,
          rule: "Only route code may import from the app layer.",
        });
      }

      if (sourceLayer === "shared" && targetLayer !== "shared") {
        violations.push({
          file: file.filePath,
          importedPath,
          rule: "Shared modules may import only shared modules.",
        });
      }

      if (
        sourceLayer === "features" &&
        (targetLayer === "widgets" ||
          (targetLayer === "features" && sourceScope !== targetScope))
      ) {
        violations.push({
          file: file.filePath,
          importedPath,
          rule: "Features cannot import widgets or sibling features.",
        });
      }

      if (
        sourceLayer === "widgets" &&
        targetLayer === "widgets" &&
        sourceScope !== targetScope
      ) {
        violations.push({
          file: file.filePath,
          importedPath,
          rule: "Widgets cannot import sibling widgets.",
        });
      }
    }
  }

  return violations;
}

async function collectSourceFiles(directory: string): Promise<SourceFile[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry): Promise<SourceFile[]> => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return collectSourceFiles(entryPath);
      }

      if (!sourceExtensions.has(path.extname(entry.name))) {
        return [];
      }

      return [
        {
          filePath: entryPath,
          source: await readFile(entryPath, "utf8"),
        },
      ];
    }),
  );

  return files.flat();
}

export async function checkArchitecture(rootDirectory = process.cwd()) {
  const sourceRoot = path.join(rootDirectory, "src");
  const files = await collectSourceFiles(sourceRoot);
  return analyzeArchitecture(files, sourceRoot);
}

async function main() {
  const violations = await checkArchitecture();

  if (violations.length === 0) {
    console.log("Architecture check passed.");
    return;
  }

  for (const violation of violations) {
    console.error(
      `${path.relative(process.cwd(), violation.file)}: ${violation.rule} Import: ${violation.importedPath}`,
    );
  }

  process.exitCode = 1;
}

const entryPath = process.argv[1] ? path.resolve(process.argv[1]) : undefined;
if (entryPath === fileURLToPath(import.meta.url)) {
  await main();
}
