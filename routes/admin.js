const express = require("express");
const path = require("path");
const router = express.Router();

// parser
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded());

const rootDir = require("../util/path");
const { title } = require("process");

const productsController = require("../controllers/products");

// /admin/add-product ==>GET
router.get("/add-product", productsController.getAddProduct);

// /admin/add-product ==>POST
router.post("/add-product", productsController.postAddProduct);

module.exports = router;
