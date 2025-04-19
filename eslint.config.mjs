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
        process: "readonly",
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    files: ["**/*.jsx"],
    plugins: {
      react: pluginReact,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        alias: {
          map: [["@", "./src"]],
          extensions: [".js", ".jsx", ".json"],
        },
      },
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      "react/jsx-uses-vars": "error", // This is crucial - ensures JSX components are recognized as used
      "react/jsx-uses-react": "error", // Ensures React is recognized as used when JSX is used
    },
  },
  {
    files: [
      "**/*.test.js",
      "**/*.spec.js",
      "**/testSetup.js",
      "**/jest.setup.js",
      "**/test/**/*.js",
    ],
    plugins: {
      jest: pluginJest,
    },
    languageOptions: {
      globals: {
        ...pluginJest.environments.globals.globals,
        global: "writable",
      },
    },
    rules: {
      ...pluginJest.configs.recommended.rules,
    },
  },
  js.configs.recommended,
  {
    plugins: {
      react: pluginReact,
      prettier: prettier,
      jest: pluginJest,
    },
    rules: {
      ...prettierConfig.rules,
      "no-unused-vars": "warn",
      "no-console": "warn",
      "react/react-in-jsx-scope": "off",
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
      jest: {
        version: "detect",
      },
      "import/resolver": {
        alias: {
          map: [["@", "./src"]],
          extensions: [".js", ".jsx", ".json"],
        },
      },
    },
  },
]);
