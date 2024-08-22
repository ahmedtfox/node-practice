const express = require("express");
const path = require("path");
const router = express.Router();

const bodyParser = require("body-parser");

const rootDir = require("../util/path");
const { title } = require("process");
router.use(bodyParser.urlencoded());

const products = [];

// /admin/add-product ==>GET
router.get("/add-product", (req, res, next) => {
  console.log("hi it's middleware 2");
  //res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("add-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
  });
});
// /admin/add-product ==>POST
router.post("/add-product", (req, res, next) => {
  console.log(req.body);
  products.push({ title: req.body.title });
  // res.send("<h1>this is product!</h1>");
  res.redirect("/");
});

exports.routs = router;
exports.products = products;
