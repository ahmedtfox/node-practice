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
      products: data,
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
      products: data,
      docTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCart = (req, res, next) => {
  //res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("shop/cart", {
    docTitle: "cart",
    path: "/cart",
  });
};

exports.getCheckout = (req, res, next) => {
  //res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("shop/checkout", {
    docTitle: "checkout",
    path: "/checkout",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    docTitle: "Your Orders",
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    //console.log(product);
    res.render("shop/product-detail", {
      product: product,
      docTitle: "product detail",
      path: "/products",
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  console.log(req.body);
  res.redirect("/cart");
};
