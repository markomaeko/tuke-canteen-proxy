const express = require("express");

const app = express();
const PORT = process.env.PORT || 3001;

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:8081", "http://localhost:19006"];

const UPSTREAM = "https://jedalen.tuke.sk";

// CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// GET /menu/:canteenSlug/:date
app.get("/menu/:canteenSlug/:date", async (req, res) => {
  const { canteenSlug, date } = req.params;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  const url = `${UPSTREAM}/jedalny-listok/${encodeURIComponent(canteenSlug)}/${date}`;

  try {
    const upstream = await fetch(url, {
      headers: { "User-Agent": "tuke-canteen-proxy/1.0" },
      signal: AbortSignal.timeout(15_000),
    });

    if (!upstream.ok) {
      return res.status(upstream.status).send(upstream.statusText);
    }

    const html = await upstream.text();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch {
    res.status(502).json({ error: "Upstream request failed" });
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Proxy listening on port ${PORT}`);
});
