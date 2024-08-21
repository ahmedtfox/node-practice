const express = require("express");
const path = require("path");
const router = express.Router();

const rootDir = require("../util/path");
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded());

const adminData = require("./admin");

router.get("/", (req, res, next) => {
  //res.send("<h1>this is shop page!</h1>");
  console.log(adminData.products);
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
  res.render("shop", { prods: adminData.products, docTitle: "Shop" });
});

module.exports = router;
