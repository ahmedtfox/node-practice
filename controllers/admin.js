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
  Product.create({
    title: title,
    price: price,
    imageURL: imageUrl,
    description: description,
  })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
  Product.findAll().then((products) => {
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

  Product.findByPk(productId)
    .then((product) => {
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
    })
    .catch((err) => {
      console.log(err);
    });

  /*  Product.findById(productId)
    .then(([product]) => {
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
    })
    .catch((err) => {
      console.log(err);
    }); */
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updated_imageUrl = req.body.imageUrl || "";
  const updated_price = req.body.price || 0;
  const updated_description = req.body.description || "";
  const updated_title = req.body.title || "";
  Product.findByPk(productId)
    .then((product) => {
      product.imageURL = updated_imageUrl;
      product.price = updated_price;
      product.description = updated_description;
      product.title = updated_title;
      return product.save();
    })
    .then((result) => {
      console.log("product updated");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.findByPk(productId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log("product Deleted");
      return res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};
