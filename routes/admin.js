const express = require("express");
const path = require("path");
const router = express.Router();

// parser
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded());

const rootDir = require("../util/path");
const { title } = require("process");

const adminController = require("../controllers/admin");

// /admin/products ==>GET
router.get("/admin/products", adminController.getProducts);
// /admin/add-product ==>GET
router.get("/admin/add-product", adminController.getAddProduct);
/* 
// /admin/products ==>GET
router.get("/product", adminController.getAddProduct);
 */
// /admin/add-product ==>POST
router.post("/admin/add-product", adminController.postAddProduct);

router.get("/admin/edit-product/:productId", adminController.getEditProduct);

router.post("/admin/edit-product", adminController.postEditProduct);

module.exports = router;
