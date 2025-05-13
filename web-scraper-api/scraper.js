const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const WEBSITES = {
  amazon: {
    nameSelector: "#productTitle",
    priceSelector: [
      "span.a-offscreen",
      "#priceblock_ourprice",
      "#priceblock_dealprice",
    ],
  },
  ebay: {
    nameSelector: ".x-item-title__mainTitle span",
    priceSelector: [".x-price-primary span", 'span[itemprop="price"]'],
  },
};

async function scrapeProduct(url) {
  if (!/^https?:\/\//i.test(url)) {
    throw new Error("Invalid URL");
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  try {
    const page = await browser.newPage();

    // NOTE: Amazon blocks requests with a user agent that doesn't match a real browser
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/114.0.5735.199 Safari/537.36"
    );
    await page.setViewport({ width: 1280, height: 800 });
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => false });
    });

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000)));

    const host = new URL(url).hostname;
    const key = Object.keys(WEBSITES).find((k) => host.includes(k));
    if (!key) {
      throw new Error(`Unsupported website: ${host}`);
    }

    const { nameSelector, priceSelector } = WEBSITES[key];

    await page.waitForSelector(nameSelector, { timeout: 15000 });
    const name = await page.$eval(
      nameSelector,
      (el) => el.innerText.trim()
    );

    let priceText = null;
    for (const sel of priceSelector) {
      try {
        await page.waitForSelector(sel, { timeout: 5000 });
        priceText = await page.$eval(sel, (el) => el.innerText.trim());
        if (priceText) break;
      } catch {
      }
    }
    if (!priceText) {
      throw new Error("Price not found using provided selectors");
    }

  // NOTE: Remove any non-numeric characters to return just the price
    const match = priceText.match(
      /[\$£€¥₹]\d{1,3}(?:,\d{3})*(?:\.\d+)?/
    );
    if (!match) {
      throw new Error("Price format did not match expected pattern");
    }
    const price = match[0];

    return { name, price };
  } finally {
    await browser.close();
  }
}

module.exports = { scrapeProduct };
