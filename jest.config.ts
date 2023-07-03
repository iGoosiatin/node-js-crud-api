export default {
  restoreMocks: true,
  resetMocks: true,
  testTimeout: 30000,
  testEnvironment: 'node',
  testRegex: 'e2e_tests/.+\\.test.ts',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};
