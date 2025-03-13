const https = require('https');

const getURLs = (addresses) => {
  addresses = turnToArray(addresses);
  const regex = new RegExp('^https://');
  return addresses.map(
    address => !regex.test(address)
      ? `https://${address.replace('http://', '')}${address.at(-1) !== '/' ? '/' : ''}`
      : `${address}${address.at(-1) !== '/' ? '/' : ''}`
  )
}

const parseTitle = (body) => {
  let match = body.match(/<title>([^<]*)<\/title>/); // regular expression to parse contents of the <title> tag
  if (!match || typeof match[1] !== 'string')
    throw new Error('Unable to parse the title tag');
  return match[1];
}

const fetchURL = (url) => fetch(url)
  .then(response => response.text())
  .then(body => [url, parseTitle(body)])
  .catch((error) => {
    console.error(`error while fetching URL(${url}) :`, error);
    return [url, 'NO RESPONSE'];
  })

const httpFetch = (url, callback = () => { }) => {
  https.get(url, (res) => {
    let data = '';
    res.setEncoding('utf8');
    if (res.statusCode === 301 || res.statusCode === 302) {
      const newRequestUri = res.headers.location;
      https.get(newRequestUri, function (res) {

        res.on('data', (d) => {
          data += d;
        })

        res.on('end', () => {
          callback([url, parseTitle(data)]);
        })
      })
    }
    else {
      res.on('data', (chunk) => {
        data += chunk;
      })
      res.on('end', () => {
        callback([url, parseTitle(data)]);
      })
    }
  }).on('error', (e) => {
    console.error(e);
    callback([url, 'NO RESPONSE']);
  })
}

const turnToArray = (addresses) => {
  return typeof addresses === "string"
    ? [addresses]
    : addresses
}

module.exports = { parseTitle, fetchURL, getURLs, httpFetch, turnToArray };