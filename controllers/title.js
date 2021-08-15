const titleRouter = require('express').Router()
const fetch = require('node-fetch')
const async = require('async')
const helper = require('../utils/helpers')

// ------------------ SIMPLE NODE --------------------

// titleRouter.get('/', (request, response) => {
//   let addresses = request.query.address
//   if (!addresses) {
//     return response.send('give address as a url parameter')
//   }
//   addresses = helper.turnToArray(addresses)
//   let titles = []
//   const urls = helper.getAddresses(addresses)
//   let urlsLength = urls.length

//   const p = (title) => {
//     titles.push(title)
//     if (titles.length === urlsLength) {
//       return response.render('index', {titles})
//     }
//   }

//   urls.forEach(url => {
//     helper.httpFetch(url, p)
//   })
// })





// ---------------- USING control flow library async.js ------------

titleRouter.get('/', (request, response) => {
  let addresses = request.query.address

  if (!addresses) {
    return response.send('give address as a url parameter')
  }

  addresses = helper.turnToArray(addresses)

  const urls = helper.getAddresses(addresses)

  async.map(urls, async (url) => {
    const response = await fetch(url)
      .then(response => response.text())
      .catch(error => '<title>NO RESPONSE</title>')
    return response
  }, (err, results) => {
      if (err) throw err
      const titles = results.map(body => helper.parseTitle(body))
      response.render('flowIndex', {addresses, titles})
  })
})





// --------------- USING PROMISES ---------------

// titleRouter.get('/', async (request, response) => {
//   let addresses = request.query.address
//   if (!addresses) {
//     return response.send('give address as a url parameter')
//   }

//   addresses = helper.turnToArray(addresses)
//   const urls = helper.getAddresses(addresses)

//   Promise.all(urls.map(url =>
//     helper.fetchURL(url)
//   )).then(titles => {
//     response.render('flowIndex', {addresses, titles})
//   })
//   .catch((error) => {
//     console.log('error: ', error)
//   })
// })

module.exports = titleRouter