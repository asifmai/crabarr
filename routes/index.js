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
  
  scraper.sendMessage(message, linkedinURL, cookieValue, proxy, port, proxyUser, proxyPassword)
    .then(result => {
      console.log(result);
      res.status = 200;
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

module.exports = router;
