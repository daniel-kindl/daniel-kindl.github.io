// @ts-check
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default defineConfig(
  {
    ignores: ['dist/', '.astro/', 'node_modules/'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,astro,svelte}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      eslintPluginAstro.configs.recommended,
      eslintPluginSvelte.configs['flat/recommended'],
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
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
