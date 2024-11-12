module.exports = {
  rootDir: '../..', // Sets the testing root as the project root
  testMatch: ['<rootDir>/__tests__/unit/**/*.js'], // Matches just the unit testing files
  setupFilesAfterEnv: ['<rootDir>/__tests__/config/setup.unit.js'] // Global set up for unit testing
};
