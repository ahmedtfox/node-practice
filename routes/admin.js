const path = require("path");

const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();
const { check } = require("express-validator");
//Protect Routes
const isAuth = require("../middleware/is-auth");

// /admin/add-product => GET
router.get("/admin/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/admin/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/admin/add-product",
  isAuth,
  [
    check("imageUrl").isURL().withMessage("invalid URL"),
    check("title").isString().trim().withMessage("invalid title"),
    check("price").isFloat().withMessage("invalid price"),
    check("description")
      .isString()
      .isLength({ min: 5, max: 400 })
      .trim()
      .withMessage("invalid description"),
  ],
  adminController.postAddProduct
);

router.get(
  "/admin/edit-product/:productId",
  isAuth,
  adminController.getEditProduct
);

router.post(
  "/admin/edit-product",
  isAuth,
  [
    check("imageUrl").isEmpty().isURL().withMessage("invalid URL"),
    check("title").isEmpty().isString().trim().withMessage("invalid title"),
    check("price").isEmpty().isFloat().withMessage("invalid price"),
    check("description")
      .isEmpty()
      .isString()
      .isLength({ min: 10 })
      .trim()
      .withMessage("invalid description"),
  ],
  adminController.postEditProduct
);

router.post("/admin/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
