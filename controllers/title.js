const titleRouter = require('express').Router();
const async = require('async');
const helper = require('../utils/helpers');
const Rx = require('rxjs');
const rxFetch = require('rxjs/fetch')

// ------------------ SIMPLE NODE --------------------

// titleRouter.get('/', (request, response) => {
//   let addresses = request.query.address;
//   if (!addresses) {
//     return response.send('give address as a url parameter');
//   }

//   let titles = [];
//   const urls = helper.getURLs(addresses);

//   const processTitle = (title) => {
//     titles.push(title);
//     if (titles.length === urls.length) {
//       return response.render('index', { titles });
//     }
//   }

//   urls.forEach(url => {
//     helper.httpFetch(url, processTitle);
//   })
// })





// ----------------USING control flow library async.js------------

// titleRouter.get('/', (request, response) => {
//   let addresses = request.query.address;

//   if (!addresses) {
//     return response.send('give address as a url parameter');
//   }

//   addresses = helper.turnToArray(addresses);
//   const urls = helper.getURLs(addresses);

//   async.map(urls, async url => helper.fetchURL(url), (err, titles) => {
//     if (err) throw err;
//     response.render('flowIndex', { addresses, titles })
//   })
// })





// --------------- USING PROMISES---------------

// titleRouter.get('/', (request, response) => {
//   let addresses = request.query.address;
//   if (!addresses) {
//     return response.send('give address as a url parameter');
//   }

//   const urls = helper.getURLs(addresses);

//   Promise.all(urls.map(url =>
//     helper.fetchURL(url)
//   )).then(titles => {
//     console.log(addresses, titles)
//     response.render('flowIndex', { addresses: helper.turnToArray(addresses), titles });
//   })
//     .catch((error) => {
//       console.log('error: ', error);
//     })
// })


// --------------- USING STREAMS (RXJS) ---------------

titleRouter.get('/', (request, response) => {
  let addresses = request.query.address;
  if (!addresses) {
    return response.send('give address as a url parameter');
  }

  const urls = helper.getURLs(addresses);
  const titles = [];

  const titlesObserverable = Rx.from(urls)
    .pipe(Rx.concatMap(url => {
      return helper.fetchURL(url);
    }));

  titlesObserverable.subscribe(title => {
    titles.push(title);
    if (titles.length === urls.length) {
      response.render('flowIndex', { addresses: helper.turnToArray(addresses), titles })
    }
  })
})

module.exports = titleRouter