const puppeteer = require('puppeteer');
const moment = require('moment');

module.exports.launchPage = (browser, cookieValue, proxyUser, proxyPassword, linkedinURL) => new Promise(async (resolve, reject) => {
  try {
    // Create New Page
    const page = await browser.newPage();

    // Set user agent for page.
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36';
    await page.setUserAgent(userAgent);

    // Pass the Webdriver Test.
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });

      Object.defineProperty(navigator, "languages", {
        get: () => ["en-US", "en"],
      });

      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });
    });

    // Set Page view port
    await page.setViewport({
      width: 1366,
      height: 500
    });

    // const blockedResources = ['image', 'stylesheet', 'media', 'font', 'texttrack', 'object', 'beacon', 'csp_report', 'imageset'];
    const blockedResources = [];
    // Set Request Interception to avoid receiving images, fonts and stylesheets for fast speed
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (blockedResources.includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.setCookie({
      'name': 'li_at',
      'value': cookieValue,
      'domain': '.www.linkedin.com'
    })

    await page.authenticate({username: proxyUser, password: proxyPassword});

    await page.goto(linkedinURL, {timeout: 0, waitUntil: 'load'});
    console.log(dt(), 'Launched Page');
    resolve(page);
  } catch (error) {
    console.log(dt(), 'Launch Page Error: ', error);
    reject(error);
  }
});

module.exports.launchBrowser = (proxy, port) => new Promise(async (resolve, reject) => {
  try {
    const proxyServer = `${proxy}:${port}`
    const browser = await puppeteer.launch({
      headless: true,                        // To run on headless: true
      args: [
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
        '--window-size=1366,500',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',      
        '--no-sandbox',                  // To run on linux
        proxyServer,    //To use a sock5 proxy
        // '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
      ],
      ignoreHTTPSErrors: true,
    });
    console.log(dt(), 'Launched Browser');
    resolve(browser);
  } catch (error) {
    console.log(dt(), 'Browser Launch Error: ', error);
    reject(error);
  }
});

const dt = () => {
  return moment().format('YYYY-MM-DD HH:mm:ss') + ' -';
}