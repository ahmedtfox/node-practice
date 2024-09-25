const express = require("express");
const path = require("path");
const router = express.Router();

const rootDir = require("../util/path");

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded());

const adminData = require("./admin");

const shopController = require("../controllers/shop");

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);
router.get("/products/:productId", shopController.getProduct);
router.post("/cart", shopController.postCart);
router.get("/cart", shopController.getCart);

/* 
router.get("/products/delete");

router.post("/cart-delete-item", shopController.postCartDeleteProduct);

router.post("/create-order", shopController.postOrder);

router.get("/orders", shopController.getOrders);

router.get("/checkout", shopController.getCheckout);
 */

module.exports = router;
