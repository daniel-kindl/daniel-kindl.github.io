// @ts-check
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import globals from 'globals';

export default defineConfig(
  {
    ignores: ['dist/', '.astro/', 'node_modules/', '.remember/'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,astro}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      eslintPluginAstro.configs.recommended,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
);
