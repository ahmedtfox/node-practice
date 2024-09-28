const Product = require("../models/products");
const Order = require("../models/order");
const error = require("./error");
const order = require("../models/order");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    activeAddProduct: true,
    productCSS: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();

  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((rows) => {
      const data = rows || [];
      res.render("shop/product-list", {
        products: data,
        docTitle: "Shop",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find().then((products) => {
    res.render("shop/index", {
      products: products,
      docTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      //console.log(cart);
      res.render("shop/cart", {
        docTitle: "cart",
        path: "/cart",
        cart: cart,
        cartTotalPrice: 0,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCheckout = (req, res, next) => {
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
  const prodId = req.params.productId.toString();
  Product.findById(prodId)
    .then((product) => {
      return res.render("shop/product-detail", {
        product: product,
        docTitle: "product detail",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .removeFromCart(productId)
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((prod) => {
        const productInfo = { ...prod.productId._doc };
        return { quantity: prod.quantity, product: productInfo };
      });
      const order = new Order({
        user: {
          name: req.user.username,
          userId: req.user,
        },
        products: products,
      });
      return order
        .save()
        .then((result) => {
          //console.log(result);
          return req.user.clearCart();
        })
        .then((result) => {
          res.redirect("/orders");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      /*    
      console.log("---".repeat(10));
      console.log(orders);
      console.log("---".repeat(10));
      console.log(orders[0].products[0]);
 */
      res.render("shop/orders", {
        path: "/orders",
        docTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect(error.page404);
    });
};
