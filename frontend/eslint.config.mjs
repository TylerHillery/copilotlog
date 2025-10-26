import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import { defineConfig } from "eslint/config";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    ignores: [".react-router/**", "build/**"],
  },
  {
    extends: compat.extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended"
    ),

    plugins: {
      "@typescript-eslint": typescriptEslint,
      "unused-imports": unusedImports,
      "simple-import-sort": simpleImportSort,
    },

    rules: {
      "simple-import-sort/imports": "error",
      "unused-imports/no-unused-imports": "error",
    },
  },
]);
