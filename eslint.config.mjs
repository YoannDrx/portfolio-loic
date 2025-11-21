import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Variables non utilisées avec pattern intelligent
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],

      // TypeScript best practices (sans type-checking)
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "warn",

      // Code quality
      "prefer-const": "error",
      "prefer-template": "error",
      "no-console": "warn",
      "no-nested-ternary": "off",

      // React rules
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",

      // Désactiver certaines règles TypeScript trop strictes
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  {
    ignores: [
      ".next/**",
      ".vercel/**",
      ".claude/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "scripts/**",
      "*.config.js",
      "*.config.mjs",
      "node_modules/**",
      ".cache/**",
      "public/**",
      "*.backup",
    ],
  }
);
