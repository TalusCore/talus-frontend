const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const tseslint = require('typescript-eslint');
const prettier = require('eslint-plugin-prettier');
const react = require('eslint-plugin-react');
const reactNative = require('eslint-plugin-react-native');
const reactHooks = require('eslint-plugin-react-hooks');
const prettierConfig = require('eslint-config-prettier');

module.exports = defineConfig([
  expoConfig,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      'react-native': reactNative,
      'react-hooks': reactHooks,
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'react-native/no-inline-styles': 'off',
      'react-native/no-color-literals': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  prettierConfig,
  {
    ignores: ['dist/*', 'node_modules/*'],
  },
]);
