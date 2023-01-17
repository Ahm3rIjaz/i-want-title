const express = require('express');
const titleRouter = require('./controllers/title');

const app = express();

app.set('view engine', 'pug');

app.use('/I/want/title', titleRouter);

app.use('*', (request, response) => {
  response.status(404).send("Page not found");
})

module.exports = app;