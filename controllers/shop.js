const Product = require("../models/products");

exports.getAddProduct = (req, res, next) => {
  //res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("admin/add-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    activeAddProduct: true,
    productCSS: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  //console.log(req.body);
  const product = new Product(req.body.title);
  product.save();
  // res.send("<h1>this is product!</h1>");
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
  Product.fetchAll((products) => {
    const data = products || [];
    res.render("shop/product-list", {
      prods: data,
      docTitle: "Shop",
      path: "/products",
    });
  });
};

exports.getIndex = (req, res, next) => {
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
  Product.fetchAll((products) => {
    const data = products || [];
    res.render("shop/index", {
      prods: data,
      docTitle: "Shop",
      path: "/",
    });
  });
};

exports.cart = (req, res, next) => {
  //res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("shop/cart", {
    docTitle: "cart",
    path: "/cart",
  });
};

exports.checkout = (req, res, next) => {
  //res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("shop/checkout", {
    docTitle: "checkout",
    path: "/checkout",
  });
};
