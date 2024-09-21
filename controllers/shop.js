const Product = require("../models/products");
const Cart = require("../models/cart");
const Order = require("../models/oder");

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
  Product.fetchAll()
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
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
  Product.fetchAll().then((products) => {
    res.render("shop/index", {
      products: products,
      docTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCart = (req, res, next) => {
  //res.sendFile(path.join(rootDir, "views", "add-product.html"));
  req.user
    .getCart()
    .then((cart) => {
      console.log(cart);
      return cart.getProducts().then((products) => {
        res.render("shop/cart", {
          docTitle: "cart",
          path: "/cart",
          cart: products,
          cartTotalPrice: 0,
        });
      });
    })
    .catch((err) => {
      console.log(err);
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

  Product.findById(prodId)
    .then((product) => {
      console.log("=====".repeat(20));
      console.log(product);
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
  const productId = Number(req.body.productId);
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let newQuantity = 1;
      if (products.length > 0) {
        const cartProductId = products[0].id;
        console.log(cartProductId, productId);
        if (cartProductId === productId) {
          console.log("it's the same product");
          newQuantity = products[0].cartItem.quantity + 1;
        }
      }
      return Product.findByPk(productId)
        .then((product) => {
          console.log(product);
          return fetchedCart.addProduct(product, {
            through: { quantity: newQuantity },
          });
        })
        .then(() => {
          res.redirect("/cart");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  let orderProducts;
  let fetchCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          orderProducts = products.map((product) => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
          });
          return order.addProducts(orderProducts);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .then((result) => {
      return fetchCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      /* 
      console.log(orders);
      console.log("---".repeat(10));
      console.log(orders[0].products[0]);
      console.log(orders[0].products[0].title);
 */
      res.render("shop/orders", {
        path: "/orders",
        docTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
