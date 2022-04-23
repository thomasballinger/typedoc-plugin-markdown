module.exports = {
  modulePaths: ['<rootDir>/dist'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  verbose: true,
  collectCoverage: false,
  coverageReporters: ['lcov', 'text', 'text-summary'],
  collectCoverageFrom: ['<rootDir>/dist/**/*js'],
  setupFiles: ['<rootDir>/test/helpers.js'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json',
    },
  },
  testTimeout: 30000,
};
