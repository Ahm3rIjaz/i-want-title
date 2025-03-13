const titleRouter = require('express').Router();
const async = require('async');
const helper = require('../utils/helpers');
const Rx = require('rxjs');
const rxFetch = require('rxjs/fetch')

titleRouter.get('/', (req, res) => {
  let addresses = req.query.address;
  if (!addresses) {
    return res.send('give address as a url parameter');
  }

  const urls = helper.getURLs(addresses);

  useCallbacks(urls, res); // callbacks
  // useAsyncJs(urls, res); // flow library
  // usePromises(urls, res); // promises
  // useStreams(urls, res); // streams
})

function useCallbacks(urls, res) {
  let titles = [];

  const processTitle = (title) => {
    titles.push(title);
    if (titles.length === urls.length) {
      return res.render('index', { titles });
    }
  }

  urls.forEach(url => {
    helper.httpFetch(url, processTitle);
  })
}

function useAsyncJs(urls, res) {
  async.map(urls, async url => helper.fetchURL(url), (err, titles) => {
    if (err) throw err;
    return res.render('index', { titles });
  })
}

function usePromises(urls, res) {
  Promise.all(urls.map(url =>
    helper.fetchURL(url)
  ))
    .then(titles => {
      return res.render('index', { titles });
    })
    .catch((error) => {
      console.error('error: ', error);
    })
}

function useStreams(urls, res) {
  Rx.from(urls)
    .pipe(
      Rx.mergeMap(url => {
        return helper.fetchURL(url);
      }),
      Rx.toArray()
    )
    .subscribe((titles) => {
      return res.render('index', { titles });
    });
}

module.exports = titleRouter