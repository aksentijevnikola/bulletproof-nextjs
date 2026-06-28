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
