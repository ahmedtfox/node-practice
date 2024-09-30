const path = require("path");

const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

//Protect Routes
const isAuth = require("../middleware/is-auth");


// /admin/add-product => GET
router.get("/admin/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/admin/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post("/admin/add-product", isAuth, adminController.postAddProduct);

router.get(
  "/admin/edit-product/:productId",
  isAuth,
  adminController.getEditProduct
);

router.post("/admin/edit-product", isAuth, adminController.postEditProduct);

router.post("/admin/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
