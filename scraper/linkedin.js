const helpers = require('./helpers');

module.exports.sendMessage = (message, linkedinURL, cookieValue, proxy, port, proxyUser, proxyPassword) => new Promise(async (resolve, reject) => {
  try {
    const browser = await helpers.launchBrowser(proxy, port);
    const page = await helpers.launchPage(browser, cookieValue, proxyUser, proxyPassword, linkedinURL);
    const messageButton = await page.$('button.pv-s-profile-actions--message');
    if (messageButton) {
      await page.click('button.pv-s-profile-actions--message');
      await page.type('.msg-form__message-texteditor', message);
      await page.click('button.msg-form__send-button');
      await page.waitFor(5000);
    } else {
      console.log('Error: The Provided Linkedin Profile is outside your network');
      reject('The Provided Linkedin Profile is outside your network')
    }
    await browser.close();
    resolve({
      status: 'SUCCESS',
      detail: 'Message Sent Successfully',
    })
  } catch (error) {
    console.log('Scrape Error: ', error);
    reject({
      status: 'FAILURE',
      detail: error,
    });
  }
})
