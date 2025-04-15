const puppeteer = require("puppeteer");

const WEBSITES = {
  'amazon': {
    nameSelector: '#productTitle',
    priceSelector: ['span.a-offscreen', '#priceblock_ourprice', '#priceblock_dealprice']
  },
  'ebay': {
    nameSelector: '.x-item-title__mainTitle span',
    priceSelector: ['.x-price-primary span', 'span[itemprop="price"]']
  },
};

async function scrapeProduct(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const host = new URL(url).hostname;
  const websiteKey = Object.keys(WEBSITES).find(key => host.includes(key));
  if (!websiteKey) throw new Error(`Unsupported website for URL: ${url}`);
  
  const websiteData = WEBSITES[websiteKey];
  
  await page.waitForSelector(websiteData.nameSelector);
  const name = await page.$eval(websiteData.nameSelector, el => el.innerText.trim());
  
  let priceText = null;
  for (const selector of websiteData.priceSelector) {
    try {
      await page.waitForSelector(selector, { timeout: 3000 });
      priceText = await page.$eval(selector, el => el.innerText.trim());
      if (priceText) break; 
    } catch (err) {}
  }
  
  if (!priceText) {
    await browser.close();
    throw new Error('Price not found using provided selectors.');
  }
  
  // NOTE: Remove any non-numeric characters to return just the price
  const match = priceText.match(/[\$£€¥₹]\d{1,3}(?:,\d{3})*(?:\.\d+)?/);
  if (!match) {
    await browser.close();
    throw new Error('Price format did not match the expected pattern.');
  }
  
  const priceFormatted = match[0];
  await browser.close();
  return { name, price: priceFormatted };
}

module.exports = { scrapeProduct };
