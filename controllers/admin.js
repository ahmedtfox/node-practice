const Product = require("../models/products");
const mongoDb = require("mongodb");
exports.getAddProduct = (req, res, next) => {
  //res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  //console.log(req.body);
  const title = req.body.title || "title";
  const imageUrl = req.body.imageUrl || "";
  const price = req.body.price || 0;
  const description = req.body.description || "";

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
  Product.find().then((products) => {
    const data = products || [];
    res.render("admin/products", {
      prods: data,
      docTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit === "true" ? true : false;
  if (!editMode) {
    return res.redirect("/");
  }

  const productId = req.params.productId;
  console.log(productId);
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      console.log("=".repeat(20));
      console.log(product);
      console.log("=".repeat(20));
      res.render("admin/edit-product", {
        prods: req.params,
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updated_imageUrl = req.body.imageUrl || "";
  const updated_price = req.body.price || 0;
  const updated_description = req.body.description || "";
  const updated_title = req.body.title || "";

  Product.findById(productId)
    .then((prod) => {
      prod.title = updated_title;
      prod.imageUrl = updated_imageUrl;
      prod.description = updated_description;
      prod.price = updated_price;

      return prod
        .save()
        .then((result) => {
          return result;
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .then((result) => {
      //console.log(result);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteById(productId)
    .then((result) => {
      console.log("product Deleted");
      return res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};
