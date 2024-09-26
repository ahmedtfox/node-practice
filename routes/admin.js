const express = require("express");
const path = require("path");
const router = express.Router();

// parser
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded());

const rootDir = require("../util/path");
const { title } = require("process");
const adminController = require("../controllers/admin");
// /admin/add-product ==>GET
router.get("/admin/add-product", adminController.getAddProduct);

// /admin/add-product ==>POST
router.post("/admin/add-product", adminController.postAddProduct);

// /admin/products ==>GET
router.get("/admin/products", adminController.getProducts);
// /admin/products ==>GET Edit product
router.get("/admin/edit-product/:productId", adminController.getEditProduct);

router.post("/admin/edit-product", adminController.postEditProduct);
router.post("/admin/delete-product", adminController.postDeleteProduct);

module.exports = router;
