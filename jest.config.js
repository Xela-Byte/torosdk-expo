/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  testPathIgnorePatterns: ['/__mocks__/', '/types/'],
  moduleNameMapper: {
    '^react-native$': '<rootDir>/__tests__/__mocks__/react-native.ts',
    '^torosdk-expo$': '<rootDir>/src/react/index.ts',
    '^torosdk-expo/core$': '<rootDir>/src/core/index.ts',
    '^torosdk-expo/cli$': '<rootDir>/src/cli/init.ts',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        strict: true,
        module: 'commonjs',
        target: 'ES2020',
        moduleResolution: 'node',
        baseUrl: '.',
        paths: {
          'react-native': ['__tests__/__mocks__/react-native.ts'],
        },
      }
    }],
  },
};
