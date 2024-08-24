const express = require("express");
const path = require("path");
const router = express.Router();

const rootDir = require("../util/path");
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded());

const adminData = require("./admin");

const productsController = require("../controllers/products");

router.get("/", productsController.getProducts);

module.exports = router;
