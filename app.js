const { text, buffer } = require("stream/consumers");

const { error } = require("console");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded());

app.use("/add-product", (req, res, next) => {
  console.log("hi it's middleware 2");
  res.send(`<form action="/product" method="post">
  <input type="text" name="title" />
  <button type="submit">send</button>
</form>`);
});

app.use("/product", (req, res, next) => {
  console.log(req.body);
  res.send("<h1>hello from Express!</h1>");
});

app.use("/", (req, res, next) => {
  console.log("hi it's middleware 2");
  res.send("<h1>hello from Express!</h1>");
});

app.listen(3000);
