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
  const title = req.body.title || "title";
  const imageUrl = req.body.imageUrl || "";
  const price = req.body.price || 0;
  const description = req.body.description || "";
  const product = new Product(title, imageUrl, description, price);

  product.save();
  // res.send("<h1>this is product!</h1>");
  res.redirect("/");
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
