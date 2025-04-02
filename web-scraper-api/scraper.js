const puppeteer = require("puppeteer");

const WEBSITES = {
  'amazon': {
    nameSelector: '#productTitle',
    priceSelector: '.a-price',
  },
  'ebay': {
    nameSelector: '.x-item-title__mainTitle span',
    priceSelector: '.x-price-primary span',
  },
}

async function scrapeProduct(url) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const website = url.split('.')[1];
  const websiteData = WEBSITES[website];

  await page.waitForSelector(websiteData.nameSelector);
  await page.waitForSelector(websiteData.priceSelector);


  const name = await page.$eval(websiteData.nameSelector, el => el.innerText.trim());
  const price = await page.$eval(websiteData.priceSelector, el => el.innerText.trim());

  // NOTE: Price must fit this pattern => [symbol][number]*[.][number]*
  const priceFormatted = price.match(/[\$£€¥₹][0-9]*[.]?[0-9]*/)[0];

  await browser.close();
  return { name, price: priceFormatted };
}

module.exports = { scrapeProduct };
