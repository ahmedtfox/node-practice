const Product = require("../models/products");

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
  const product = new Product(null, title, imageUrl, description, price);
  product
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
  Product.fetchAll((products) => {
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
  Product.findById(productId, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      prods: req.params,
      docTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  //console.log(productId, "postedit");
  const updated_imageUrl = req.body.imageUrl;
  const updated_price = req.body.price;
  const updated_description = req.body.description;
  const updated_title = req.body.title;
  const updated_Product = new Product(
    productId,
    updated_title,
    updated_imageUrl,
    updated_description,
    updated_price
  );
  updated_Product.save();
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.delete(productId);
  console.log(productId);
  return res.redirect("/");
};
