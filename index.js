const mongoose = require('mongoose');
const { server } = require('./server');

// Starts the server after making sure that database is successfully connected
mongoose.connect('mongodb://127.0.0.1:27017/my-db').then(() => {
  const app = server();

  app.listen(3004, () => {
    console.log('Listening ...');
  });
});
