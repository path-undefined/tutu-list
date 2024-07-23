import stylisticEslintPlugin from "@stylistic/eslint-plugin";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import typescriptEslintParser from "@typescript-eslint/parser";
import myEslintRules from "my-eslint-rules";

import eslintPluginVue from "eslint-plugin-vue";

export default [
  ...eslintPluginVue.configs["flat/recommended"],

  {
    files: [
      "src/**/*.vue",
    ],

    languageOptions: {
      parserOptions: {
        parser: typescriptEslintParser,
        extraFileExtensions: [".vue"],
        sourceType: "module",
      },
    },
  },

  {
    files: [
      "*.mjs",
      "*.ts",
      "src/**/*.ts",
    ],

    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        sourceType: "module",
      },
    },
  },

  {
    files: [
      "*.mjs",
      "*.ts",
      "src/**/*.ts",
      "src/**/*.vue",
    ],

    plugins: {
      "@stylistic": stylisticEslintPlugin,
      "@typescript-eslint": typescriptEslintPlugin,
    },

    rules: {
      ...myEslintRules,
    },
  },
];
