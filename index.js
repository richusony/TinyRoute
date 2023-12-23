require("dotenv").config();
const express = require("express");
const shortid = require("shortid"); // or const { nanoid } = require('nanoid');
const path = require("path");
const { connectMongo } = require("./connection");
const app = express();

const { urlModel } = require("./model/urlSchema");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//MongoDB Connection
connectMongo(`${process.env.MONGODB_URI}`).then(() => {
  console.log("MongoDB Connected!!");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/assets/", express.static("./assets"));



app.get("/", (req, res) => {
  res.render("index.ejs");
});

// Handle POST request to shorten URLs
app.post("/shorten", async (req, res) => {
  const originalUrl = req.body.url;
  console.log(originalUrl);
  const shortUrl = generateShortUrl(); // Implement your short URL generation logic here

  if (shortUrl != "" || shortUrl != undefined || shortUrl != null) {
    const adding = await urlModel.create({
      shortId: shortUrl,
      originalUrl: originalUrl,
    });
    if (adding) {
      res.status(200).json({ originalUrl, shortUrl });
    } else {
      res.status(400).json({ err: "Database is having some issues" });
    }
  } else {
    res.status(400).json({ err: "Server is having some issues" });
  }

  console.log(shortUrl);
});

// Handle GET request to redirect short URLs to original URLs
app.get("/:shortUrl", async (req, res) => {
  const shortUrl = req.params.shortUrl;

  const findUrl = await urlModel.findOne({ shortId: `${process.env.domain}/${shortUrl}` });
  if (findUrl) {
    const originalUrl = findUrl.originalUrl;
    res.redirect(originalUrl);
  }else {
    res.status(404).send("URL not found");
  }
});

// Function to generate short URLs (using shortid or nanoid)
function generateShortUrl() {
  // Generate a short ID using shortid
  const shortId = shortid.generate();
  console.log(shortId);

  // You can use this short ID directly as the short URL
  // Or you might prepend a custom domain to create a complete short URL
  const shortUrl = `${process.env.domain}/${shortId}`;

  return shortUrl;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
