const express = require("express");
const { scrapeProduct } = require("./scraper");

const app = express();
app.use(express.json());

app.post("/scrape", async (req, res) => {
  const { url } = req.body;
  try {
    const { name, price } = await scrapeProduct(url);
    console.log("Scraped product", name, price);  
    res.json({ success: true, name, price });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Scraping failed" });
  }
});

app.listen(4000, () => {
  console.log("Scraper API running on http://localhost:4000");
});
