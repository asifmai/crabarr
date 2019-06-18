var express = require('express');
var router = express.Router();
const scraper = require('../scraper/linkedin');

/* GET home page. */
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
