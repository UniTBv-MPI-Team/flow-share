const tseslint = require("@typescript-eslint/eslint-plugin");
const tsparser = require("@typescript-eslint/parser");

module.exports = [
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            parser: tsparser,
        },
        plugins: {
            "@typescript-eslint": tseslint,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "no-console": "off",
        },
    },
    {
        ignores: ["dist/", "node_modules/", "src/generated/"],
    },
];
