const { text, buffer } = require("stream/consumers");

const { error } = require("console");

const express = require("express");
const app = express();

const admin = require("./routes/admin"); // order of importing doesn't matter
const shop = require("./routes/shop");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded());

app.use(admin);
app.use(shop); // order of using the routes matter
// it doesn't matter because we use get

app.listen(3000);
