import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import pluginJest from "eslint-plugin-jest";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx,html,css,scss}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        global: "readonly",
        process: "readonly"
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    files: ["**/*.test.js", "**/*.spec.js", "**/testSetup.js", "**/jest.setup.js", "**/test/**/*.js"],
    plugins: {
      jest: pluginJest
    },
    languageOptions: {
      globals: {
        ...pluginJest.environments.globals.globals,
        global: "writable"
      }
    },
    rules: {
      ...pluginJest.configs.recommended.rules
    }
  },
  js.configs.recommended,
  {
    plugins: {
      react: pluginReact,
      prettier: prettier,
      jest: pluginJest
    },
    rules: {
      ...prettierConfig.rules,
      "no-unused-vars": "warn",
      "no-console": "warn",
      "react/react-in-jsx-scope": "off",
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
    settings: {
      react: {
        version: "detect",
      },
      jest: {
        version: "detect",
      }
    },
  }
]);