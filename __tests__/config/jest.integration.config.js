module.exports = {
  rootDir: '../..', // Sets the testing root as the project root
  testMatch: ['<rootDir>/__tests__/integration/**/*.js'], // Matches just the integration testing files
  setupFilesAfterEnv: ['<rootDir>/__tests__/config/setup.integration.js'] // Global set up for integration testing
};
