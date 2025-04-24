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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Scraper API running on http://localhost:${PORT}`);
});
