module.exports = {
    preset: 'ts-jest',

    testEnvironment: 'node',

    testMatch: [
        "**/tests/**/*.test.ts"
    ],

    rootDir: './',

    roots: [
        "<rootDir>/src"
    ],

    testPathIgnorePatterns: [
        "/node_modules/",
        "/src/generated/"
    ],

    clearMocks: true,

    transform: {
            '^.+\\.tsx?$': [
                'ts-jest', 
                {
                    tsconfig: 'tsconfig.json',
                }
            ],
        },

    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/generated/**"
    ],

    coverageDirectory: "coverage",

    coverageThreshold:{},

    moduleNameMapper:{

    }, 
};