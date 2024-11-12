module.exports = {
  rootDir: '../..', // Sets the testing root as the project root
  preset: 'jest-puppeteer', // Uses Puppeteer as a preset for e2e testing
  testMatch: ['<rootDir>/__tests__/e2e/**/*.js'], // Matches just the e2e testing files
  setupFilesAfterEnv: ['<rootDir>/__tests__/config/setup.e2e.js'] // Global set up for e2e testing
};
