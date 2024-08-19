const express = require("express");
const path = require("path");
const router = express.Router();

const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded());

// /admin/add-product ==>GET
router.get("/add-product", (req, res, next) => {
  console.log("hi it's middleware 2");
  res.sendFile(path.join(__dirname, "../", "views", "add-product.html"));
});
// /admin/add-product ==>POST
router.post("/add-product", (req, res, next) => {
  console.log(req.body);
  // res.send("<h1>this is product!</h1>");
  res.redirect("/");
});

module.exports = router;
