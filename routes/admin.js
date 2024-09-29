const path = require("path");

const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

// /admin/add-product => GET
router.get("/admin/add-product", adminController.getAddProduct);

// /admin/products => GET
router.get("/admin/products", adminController.getProducts);

// /admin/add-product => POST
router.post("/admin/add-product", adminController.postAddProduct);

router.get("/admin/edit-product/:productId", adminController.getEditProduct);

router.post("/admin/edit-product", adminController.postEditProduct);

router.post("/admin/delete-product", adminController.postDeleteProduct);

module.exports = router;
