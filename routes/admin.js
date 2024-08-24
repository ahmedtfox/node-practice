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
router.get("/admin/editproduct", adminController.getEditProducts);
// /admin/add-product ==>GET
router.get("/add-product", adminController.getAddProduct);
/* 
// /admin/products ==>GET
router.get("/product", adminController.getAddProduct);
 */
// /admin/add-product ==>POST
router.post("/add-product", adminController.postAddProduct);

module.exports = router;
