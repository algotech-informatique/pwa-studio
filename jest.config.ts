import type { Config } from 'jest';

const jestConfig: Config = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: [
        '<rootDir>/jest-setup.ts'
    ],
    globals: {
        'ts-jest': {
            useESM: true,
            stringifyContentPathRegex: '\\.(html|svg)$',
            tsconfig: '<rootDir>/tsconfig.spec.json',
        },
    },
    testMatch: [
        '**/?(*.)+(test).[tj]s?(x)',
        '!**/test.ts'
    ],
};

export default jestConfig;
