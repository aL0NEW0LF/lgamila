import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginImport from "eslint-plugin-prettier/recommended"
import tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";
import unusedImports from "eslint-plugin-unused-imports";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  eslintPluginImport,
  ...tseslint.configs.recommended,
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ["dist/**", "node_modules/**", ".plasmo/**", ".turbo/**"],
  },
  {
    plugins: {
        "unused-imports": unusedImports,
    },
    rules: {
       "@typescript-eslint/no-unused-vars": "off",
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": [
            "warn",
            {
                "vars": "all",
                "varsIgnorePattern": "^_",
                "args": "after-used",
                "argsIgnorePattern": "^_",
            },
        ]
    }
}
];
