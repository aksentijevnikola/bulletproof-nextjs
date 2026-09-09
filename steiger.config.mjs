import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // These legacy layers and the pre-public-API Shared segment remain only
    // until their respective migration tasks replace them.
    ignores: [
      "./src/app/**",
      "./src/features/**",
      "./src/shared/**",
      "./src/test/**",
      "./src/widgets/**",
    ],
  },
  {
    // FSD's Next.js guide requires `_app` to avoid the framework `app/`
    // collision. Plugin 0.7.0 still classifies that name as a sliced layer,
    // so the local checker owns these App-layer structural rules.
    files: ["./src/_app/**"],
    rules: {
      "fsd/no-segmentless-slices": "off",
      "fsd/no-segments-on-sliced-layers": "off",
      "fsd/typo-in-layer-name": "off",
    },
  },
  {
    // FSD's Next.js guide likewise requires `_pages`; plugin 0.7.0 reports
    // only the underscore as a typo while other page rules remain useful.
    files: ["./src/_pages/**"],
    rules: {
      "fsd/typo-in-layer-name": "off",
    },
  },
]);
