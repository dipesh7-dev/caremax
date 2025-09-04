/* eslint-env node */
/**
 * ESLint configuration for the NDIS portal frontend.  This file
 * enables recommended rules from ESLint, React, React hooks and
 * import ordering.  Prettier is integrated via the
 * `eslint-config-prettier` extension to disable any stylistic rules
 * that would conflict with Prettier formatting.
 */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/react',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'react-hooks', 'import'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Custom rules or overrides can be added here.
  },
};