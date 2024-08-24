const express = require("express");
const path = require("path");
const router = express.Router();

const rootDir = require("../util/path");
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded());

const adminData = require("./admin");

const productsController = require("../controllers/products");

const cart = require("../controllers/cart");

router.get("/", productsController.getProducts);

router.get("/cart", cart.cart);

module.exports = router;
