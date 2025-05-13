const express = require("express");
const { scrapeProduct } = require("./scraper");

const app = express();
app.use(express.json());

app.post("/scrape", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res
      .status(400)
      .json({ error: "Missing required field `url` in request body" });
  }

  try {
    const { name, price } = await scrapeProduct(url);
    console.log("Scraped product:", name, price);
    res.json({ success: true, name, price });
  } catch (err) {
    console.error("Scraping error:", err.message);
    res.status(502).json({ error: err.message || "Scraping failed" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Scraper API running on http://localhost:${PORT}`);
});
