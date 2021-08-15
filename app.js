const express = require('express')
const cors = require('cors')
const titleRouter = require('./controllers/title')

const app = express()

app.use(cors())
app.set('view engine', 'pug')

app.use('/I/want/title', titleRouter)

app.use('*', (request, response) => {
  response.status(404).send("Page not found")
})

module.exports = app