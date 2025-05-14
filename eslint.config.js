import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginPrettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      globals: globals.browser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      js,
      prettier: pluginPrettier,
      react: pluginReact,
    },
    rules: {
      ...js.configs.recommended.rules,
      "prettier/prettier": "error",
      indent: ["error", 2, { SwitchCase: 1 }],
      "no-multi-spaces": "error",
      "block-scoped-var": "error",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      semi: ["error", "always"],
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    extends: [
      configPrettier,
    ],
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
