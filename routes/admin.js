const express = require("express");

const router = express.Router();

const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded());

router.get("/add-product", (req, res, next) => {
  console.log("hi it's middleware 2");
  res.send(`<form action="/product" method="post">
    <input type="text" name="title" />
    <button type="submit">send</button>
  </form>`);
});

router.post("/product", (req, res, next) => {
  console.log(req.body);
  res.send("<h1>this is product!</h1>");
});

module.exports = router;
