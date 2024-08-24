const Product = require("../models/products");

exports.cart = (req, res, next) => {
  //res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("shop/cart", {
    docTitle: "Add Product",
    path: "/cart",
    activeAddProduct: true,
    productCSS: true,
  });
};
