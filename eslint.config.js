import { defineConfig } from 'eslint-define-config';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import stylisticPlugin from '@stylistic/eslint-plugin';
import chaiFriendly from 'chai-friendly';

export default defineConfig({
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'commonjs',
        project: './tsconfig.json',
        ecmaFeatures: {
            impliedStrict: true,
        },
    },
    env: {
        browser: true,
        es2022: true,
        mocha: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
    ],
    plugins: {
        '@typescript-eslint': typescriptEslint,
        'eslint-plugin-import': importPlugin,
        '@stylistic': stylisticPlugin,
        'chai-friendly': chaiFriendly,
    },
    rules: {
        '@typescript-eslint/no-var-requires': 'off', // allows require statements outside of imports
        'no-async-promise-executor': 'off', // Deactivated for now as I do not know how to fix it safely
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'variable',
                format: ['camelCase', 'UPPER_CASE'],
            },
        ],
        '@stylistic/semi': 'warn',
        curly: 'warn',
        eqeqeq: 'warn',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'no-throw-literal': 'warn',
        '@typescript-eslint/no-floating-promises': 'warn',
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: ['**/test/**', '**/ui-test/**'],
                optionalDependencies: false,
                peerDependencies: false,
            },
        ],
        'no-unused-expressions': 'off', // disable original rule, use the chai-friendly one
        'chai-friendly/no-unused-expressions': 'error',
    },
});
