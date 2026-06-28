import { describe, expect, test } from "vitest";
import { validateDependencies } from "./check-dependencies";

const validManifest = {
  dependencies: {
    "@tanstack/react-query": "5.101.1",
    react: "19.2.7",
    "react-dom": "19.2.7",
  },
  devDependencies: {
    "@tanstack/react-query-devtools": "5.101.1",
    "@vitest/coverage-v8": "4.1.9",
    vitest: "4.1.9",
  },
};

describe("validateDependencies", () => {
  test("accepts the approved dependency baseline", () => {
    expect(validateDependencies(validManifest, true)).toEqual([]);
  });

  test("rejects prohibited and prerelease dependencies", () => {
    const violations = validateDependencies(
      {
        ...validManifest,
        dependencies: {
          ...validManifest.dependencies,
          axios: "1.0.0",
          next: "17.0.0-canary.1",
        },
      },
      true,
    );

    expect(violations).toContain(
      "axios is prohibited by the project baseline.",
    );
    expect(violations).toContain(
      "next@17.0.0-canary.1 is a prerelease dependency.",
    );
  });

  test("requires aligned companion package versions and a lockfile", () => {
    const violations = validateDependencies(
      {
        dependencies: {
          "@tanstack/react-query": "5.101.0",
          react: "19.2.7",
          "react-dom": "19.2.6",
        },
        devDependencies: {
          "@tanstack/react-query-devtools": "5.101.1",
          "@vitest/coverage-v8": "4.1.8",
          vitest: "4.1.9",
        },
      },
      false,
    );

    expect(violations).toHaveLength(4);
  });
});
