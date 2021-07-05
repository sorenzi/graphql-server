module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: ['(/src/modules/*/*/.*|(\\.|/)(test))\\.(ts?)$'],
  testPathIgnorePatterns: ['/lib/', '/node_modules/', '/src/middleware'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8'
};
