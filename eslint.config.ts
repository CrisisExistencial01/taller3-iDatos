import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import globals from 'globals';

export default [
    { languageOptions: { globals: globals.browser } },
    js.configs.recommended,

    {
        plugins: {
            '@next/next': nextPlugin,
        },
        rules: {
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs['core-web-vitals'].rules,
        },
    },

    {
        ignores: [
            'node_modules/**',
            '.next/**',
            'dist/**',
            '*.config.js',
        ],
    },
];
