import path from "node:path";
import { describe, expect, test } from "vitest";
import { analyzeArchitecture, type SourceFile } from "./check-architecture";

const sourceRoot = path.resolve("src");

function sourceFile(relativePath: string, source: string): SourceFile {
  return {
    filePath: path.join(sourceRoot, relativePath),
    source,
  };
}

describe("analyzeArchitecture", () => {
  test("allows the target FSD dependency direction through public APIs", () => {
    const violations = analyzeArchitecture(
      [
        sourceFile("_app/ui/app-shell.tsx", 'import "@/_pages/dashboard";'),
        sourceFile(
          "_pages/dashboard/ui/dashboard-page.tsx",
          'import "@/shared/ui";',
        ),
      ],
      sourceRoot,
    );

    expect(violations).toEqual([]);
  });

  test("rejects upward imports from pages", () => {
    const violations = analyzeArchitecture(
      [
        sourceFile(
          "_pages/dashboard/ui/dashboard-page.tsx",
          'import "@/_app/providers";',
        ),
      ],
      sourceRoot,
    );

    expect(violations[0]?.rule).toBe("Pages cannot import from the app layer.");
  });

  test("rejects sibling page imports", () => {
    const violations = analyzeArchitecture(
      [
        sourceFile(
          "_pages/dashboard/ui/dashboard-page.tsx",
          'import "@/_pages/settings";',
        ),
      ],
      sourceRoot,
    );

    expect(violations[0]?.rule).toBe(
      "Pages cannot import sibling page slices.",
    );
  });

  test("rejects bypasses of page and shared public APIs", () => {
    const violations = analyzeArchitecture(
      [
        sourceFile("_app/ui/app-shell.tsx", 'import "@/_pages/dashboard/ui";'),
        sourceFile(
          "_pages/dashboard/ui/dashboard-page.tsx",
          'import "@/shared/ui/button";',
        ),
      ],
      sourceRoot,
    );

    expect(violations.map((violation) => violation.rule)).toEqual([
      "Cross-slice imports must use a page slice public API.",
      "Cross-segment imports must use a shared segment public API.",
    ]);
  });

  test("rejects legacy layers from target FSD layers during migration", () => {
    const violations = analyzeArchitecture(
      [
        sourceFile("_app/ui/app-shell.tsx", 'import "@/widgets/app-shell";'),
        sourceFile(
          "_pages/dashboard/ui/dashboard-page.tsx",
          'import "@/features/activity";',
        ),
      ],
      sourceRoot,
    );

    expect(violations.map((violation) => violation.rule)).toEqual([
      "Target FSD layers cannot import from legacy layers.",
      "Target FSD layers cannot import from legacy layers.",
    ]);
  });

  test("allows the documented dependency direction", () => {
    const violations = analyzeArchitecture(
      [
        sourceFile("app/page.tsx", 'import "@/widgets/home-page";'),
        sourceFile(
          "widgets/home-page/index.ts",
          'import "@/features/theme-switcher";',
        ),
        sourceFile(
          "features/theme-switcher/index.ts",
          'import "@/shared/lib/cn";',
        ),
      ],
      sourceRoot,
    );

    expect(violations).toEqual([]);
  });

  test("rejects shared imports from product layers", () => {
    const violations = analyzeArchitecture(
      [sourceFile("shared/lib/invalid.ts", 'import "@/features/login/model";')],
      sourceRoot,
    );

    expect(violations[0]?.rule).toBe(
      "Shared modules may import only shared modules.",
    );
  });

  test("rejects sibling feature imports", () => {
    const violations = analyzeArchitecture(
      [
        sourceFile(
          "features/login/model.ts",
          'import "@/features/settings/model";',
        ),
      ],
      sourceRoot,
    );

    expect(violations[0]?.rule).toBe(
      "Features cannot import widgets or sibling features.",
    );
  });

  test("rejects server-only imports from client modules", () => {
    const violations = analyzeArchitecture(
      [
        sourceFile(
          "features/theme-switcher/ui.tsx",
          '"use client";\nimport "@/shared/env/env.server";',
        ),
      ],
      sourceRoot,
    );

    expect(violations[0]?.rule).toBe(
      "Client modules cannot import server-only modules.",
    );
  });
});
