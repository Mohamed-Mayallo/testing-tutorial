const path = require('path');
const express = require('express');
const { registerController } = require('./controllers/register.controller');

const server = () => {
  const app = express();

  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');

  app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, './views/register.html'));
  });

  app.get('/success', (_, res) => {
    res.send('User is registered successfully');
  });

  app.get('/error', (req, res) => {
    const msg = req.query?.msg || 'Error';
    res.send(msg);
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.post('/register', async (req, res) => {
    try {
      await registerController(req.body);
    } catch (error) {
      res.redirect(`/error?msg=${error.message}`);
      return;
    }

    res.redirect('/success');
  });

  return app;
};

module.exports = {
  server
};
