const { text, buffer } = require("stream/consumers");

const { error } = require("console");

const express = require("express");
const app = express();
const path = require("path");

const admin = require("./routes/admin"); // order of importing doesn't matter
const shop = require("./routes/shop");
const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded());

app.use(express.static(path.join(__dirname, "public")));//76. Serving Files Statically
app.use("/admin", admin.routs);
app.use(shop); // order of using the routes matter
// it doesn't matter because we use get
app.use((req, res, next) => {
  //res.status(404).send("<h1>page note found</h1>");
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(3000);
