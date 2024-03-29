var express = require('express');
var router = express.Router();
const scraper = require('../scraper/linkedin');

// GET Server Status
router.get('/', (req, res, next) => {
  res.status = 200;
  res.send('The server is running...')
})

/* POST Send Message to linkedin */
router.post('/sendmessage', (req, res, next) => {
  const {message, linkedinURL, cookieValue, proxy, port, proxyUser, proxyPassword} = req.body;
  if(!message || !linkedinURL || !cookieValue || !proxy || !port || !proxyUser || !proxyPassword) {
    console.log('Request body is incomplete')
    res.status = 500;
    res.send('The Request body is incomplete');
  } else {
    scraper.sendMessage(message, linkedinURL, cookieValue, proxy, port, proxyUser, proxyPassword)
      .then(result => {
        console.log(result);
        res.status = 200;
        res.json(result);
      })
      .catch(err => {
        console.log(err);
        res.status = 500;
        res.send(err);
      });
  }
  
});

module.exports = router;
