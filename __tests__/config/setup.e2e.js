// Global set up for e2e testing

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { server } = require('../../server');

let testingApp;
let inMemoryServer;

// Runs before every test file
beforeAll(async () => {
  jest.setTimeout(50000); // Increase Jest timeout in case of e2e testing

  // Spins up the In-memory MongoDB database
  inMemoryServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'my-db-test'
    }
  });

  // Connects to the in-memory database
  await mongoose.connect(inMemoryServer.getUri());

  // Initializes our server
  const app = server();
  testingApp = app.listen(3004);
});

// Runs after every test file
afterAll(async () => {
  // Stops the database connection
  await inMemoryServer?.stop();
  // Closes the Express app
  testingApp?.close();
});

// Runs before every test case
beforeEach(async () => {
  // Cleans up the in-memory database
  await mongoose.connection.collections['users'].drop();
});
