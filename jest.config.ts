import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  transform: { '^.+\\.ts?$': 'ts-jest' },
  testEnvironment: 'node',
  testRegex: '\\.(test|spec)?\\.(ts|tsx)$', // '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testTimeout: 15000,
  modulePathIgnorePatterns: ['/_FUNCTIONS/integromat'],
  transformIgnorePatterns: [
    '/node_modules/(?!astronomia|date-holidays-parse)', // does not work unfortunately. Line could be deleted.
  ],
};
export default config;
