const Product = require("../models/products");
const Cart = require("../models/cart");
const { where } = require("sequelize");
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
  Product.fetchAll().then(([rows, fieldData]) => {
    const data = rows || [];
    res.render("shop/product-list", {
      products: data,
      docTitle: "Shop",
      path: "/products",
    });
  });
};

exports.getIndex = (req, res, next) => {
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
  Product.findAll().then((products) => {
    res.render("shop/index", {
      products: products,
      docTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCart = (req, res, next) => {
  //res.sendFile(path.join(rootDir, "views", "add-product.html"));
  Cart.getCart((cart) => {
    let cartInfo = [];
    Product.fetchAll().then(([products, fieldData]) => {
      let cartProducts = cart.cartProducts;
      let cartTotalPrice = cart.totalPrice;
      for (let i = 0; i < cartProducts.length; i++) {
        for (let ii = 0; ii < products.length; ii++) {
          if (cartProducts[i].productId === products[ii].Id) {
            let cartProduct = products[ii];
            let product = {
              Id: cartProduct.Id,
              title: cartProduct.title,
              imageURL: cartProduct.imageURL,
              description: cartProduct.description,
              price: cartProduct.price,
              qty: cartProducts[i].qty,
            };
            cartInfo.push(product);
          }
        }
      }
      res.render("shop/cart", {
        docTitle: "cart",
        path: "/cart",
        cart: cartInfo,
        cartTotalPrice: cartTotalPrice,
      });
    });
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

  Product.findAll({ where: { id: prodId } }).then((products) => {
    const product = products[0];
    res.render("shop/product-detail", {
      product: product,
      docTitle: "product detail",
      path: "/products",
    });
  });
  /*   Product.findByPk(prodId).then((result) => {
    const product = result;
    console.log(product);
    res.render("shop/product-detail", {
      product: product,
      docTitle: "product detail",
      path: "/products",
    });
  }); */
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId).then((result) => {
    const product = result[0][0];
    console.log(product);
    Cart.addProduct(product.id, product.price);
    res.redirect("/cart");
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.deleteCartProduct(product.Id, product.price);
    res.redirect("/cart");
  });
};
