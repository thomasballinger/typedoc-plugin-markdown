module.exports = {
  modulePaths: ['<rootDir>/dist'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['lcov', 'text', 'text-summary'],
  coverageProvider: 'v8',
  setupFiles: ['<rootDir>/test/jest-helpers.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json',
    },
  },
  testTimeout: 30000,
};
