const product = require("../models/product");
const Product = require("../models/product");
const { validationResult } = require("express-validator");
const debug = require("../util/debug").printOut;

const deleteFile = require("../util/file");
exports.getAddProduct = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    errorMessage: message,
    oldInput: {
      title: "",
      imageUrl: "",
      price: "",
      description: "",
    },
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description.trim();
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      path: "/admin/add-product",
      pageTitle: "Add-product",
      errorMessage: "Attached file is not an image",
      editing: false,
      oldInput: {
        title: title,
        price: price,
        description: description,
      },
      validationErrors: [],
    });
  }
  const imageUrl = "\\" + image.path;
  debug(imageUrl);
  const errors = validationResult(req);
  const msgs = errors.array().map((error) => {
    return error.msg;
  });
  const errorsPath = errors.array().map((error) => {
    return error.path;
  });
  console.log(errorsPath);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      path: "/admin/add-product",
      pageTitle: "Add-product",
      errorMessage: msgs,
      editing: false,
      oldInput: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      },
      validationErrors: errorsPath,
    });
  }

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.session.user,
  });
  product
    .save()
    .then((result) => {
      // console.log(result);
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      debug(product);
      res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: true,
        prod: product,
        errorMessage: message,
        oldInput: {
          title: "",
          imageUrl: "",
          price: "",
          description: "",
        },
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImage = req.file;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);
  const msgs = errors.array().map((error) => {
    return error.msg;
  });
  const errorsPath = errors.array().map((error) => {
    return error.path;
  });
  console.log(errorsPath);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      path: "/admin/add-product",
      pageTitle: "Add-product",
      errorMessage: msgs,
      editing: true,
      oldInput: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
      },
      prod: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId,
      },
      validationErrors: errorsPath,
    });
  }

  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      if (updatedImage) {
        deleteFile(product.imageUrl);
        product.imageUrl = "\\" + updatedImage.path;
      }
      return product
        .save()
        .then((result) => {
          console.log("UPDATED PRODUCT!");
          res.redirect("/admin/products");
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  const userId = req.user._id;
  Product.find({ userId: userId })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        throw new Error("product not found.");
      }
      const imagePath = product.imageUrl.slice(1);
      deleteFile(imagePath);
      return Product.deleteOne({ _id: prodId, userId: req.user._id })
        .then(() => {
          console.log("DESTROYED PRODUCT");
          res.redirect("/admin/products");
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
