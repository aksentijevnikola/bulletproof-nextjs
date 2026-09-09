import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDirectory = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(rootDirectory, "src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["e2e/**", "node_modules/**", ".next/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      include: [
        "src/_app/**/*.{ts,tsx}",
        "src/_pages/**/*.{ts,tsx}",
        "src/shared/**/*.{ts,tsx}",
        "scripts/**/*.ts",
      ],
      exclude: [
        "**/*.test.{ts,tsx}",
        "src/shared/ui/**",
        "src/test/**",
        "scripts/**/*.test.ts",
      ],
    },
  },
});
