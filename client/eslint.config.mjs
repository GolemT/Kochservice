import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import prettier from 'eslint-config-prettier'

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
        },
        rules: {
            ...reactPlugin.configs.recommended.rules,
            ...reactHooksPlugin.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off', // Not needed in React 17+
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    prettier,
]