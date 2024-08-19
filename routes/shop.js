const express = require("express");

const router = express.Router();

const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded());

router.get("/", (req, res, next) => {
  res.send("<h1>this is shop page!</h1>");
});

module.exports = router;
