import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,

    {
        files: ["**/*.ts"],
        languageOptions: {
            ecmaVersion: 14,
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 14,
                sourceType: "module",
                project: true
            }
        },
        plugins: {
            "@typescript-eslint": tsPlugin
        },
        extends: [
            eslint.configs.recommended,
            tseslint.configs.recommended,
            tseslint.configs.recommendedTypeChecked
        ],
        rules: {
            "@typescript-eslint/array-type": ["warn", {
                "readonly": "generic"
            }],
            "@typescript-eslint/explicit-function-return-type": ["warn", {
                "allowExpressions": true
            }],
            "@typescript-eslint/no-explicit-any": 2,
            "@typescript-eslint/no-unsafe-argument": 0,
            "@typescript-eslint/no-unsafe-assignment": 0,
            "@typescript-eslint/no-unsafe-call": 0,
            "@typescript-eslint/no-unsafe-member-access": 0,
            "@typescript-eslint/no-unused-vars": 1,
            "@typescript-eslint/no-unused-expressions": 0,
            "@typescript-eslint/no-var-requires": 0,
            "@typescript-eslint/no-misused-promises": ["error", {
                "checksVoidReturn": {
                    "arguments": false
                }
            }],
            "arrow-parens": ["warn", "always"],
            "brace-style": ["warn", "1tbs"],
            "camelcase": 1,
            "comma-dangle": ["error", "never"],
            "comma-style": ["error", "last"],
            "eol-last": ["warn", "always"],
            "eqeqeq": ["warn", "smart"],
            "indent": ["warn", 4, {
                "MemberExpression": 0
            }],
            "key-spacing": ["warn", {
                "mode": "strict"
            }],
            "keyword-spacing": ["warn", {
                "after": true,
                "before": true
            }],
            "no-multi-spaces": 1,
            "no-multiple-empty-lines": ["warn", {
                "max": 1
            }],
            "no-return-await": 1,
            "no-trailing-spaces": 1,
            "no-unused-expressions": 0,
            "no-useless-escape": 0,
            "quotes": ["warn", "single"],
            "semi": "error",
            "semi-style": ["error", "last"],
            "sort-imports": ["warn", {
                "ignoreCase": false,
                "ignoreDeclarationSort": true
            }]
        },
    },
    {
        ignores: [
            "node_modules",
            "package.json",
            "package-lock.json",
            "dist"
        ]
    }
);
