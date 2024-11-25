const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");
const FS = require("fs");
const path = require("path");
const debug = require("../util/debug").printOut;
const pdfDocument = require("pdfkit");
const product = require("../models/product");
require("dotenv").config();
const STRIPE_KEY = process.env.STRIPE_KEY;
const stripe = require("stripe")(STRIPE_KEY);
const ITEMS_PER_PAGE = 1;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;

      Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .then((products) => {
          res.render("shop/product-list", {
            prods: products,
            pageTitle: "Products",
            path: "/products",
            currentPage: page,
            totalItems: totalItems,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;

      Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .then((products) => {
          res.render("shop/index", {
            prods: products,
            pageTitle: "Shop",
            path: "/",
            totalItems: totalItems,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  let total = 0;
  let products;
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      products = user.cart.items;
      products.forEach((p) => {
        total += p.quantity * p.productId.price;
      });

      const line_items = products.map((p) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: p.productId.title,
            },
            unit_amount: p.productId.price * 100, // Amount in cents
          },
          quantity: p.quantity,
        };
      });

      const success_url =
        req.protocol + "://" + req.get("host") + "/checkout/success";
      const cancel_url =
        req.protocol + "://" + req.get("host") + "/checkout/cancel";

      return stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: line_items,
        mode: "payment",
        shipping_address_collection: {
          allowed_countries: ["US", "BR"],
        },
        success_url: success_url,
        cancel_url: cancel_url,
      });
    })
    .then((session) => {
      console.log(session);
      res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Your checkout",
        products: products,
        totalSum: total,
        sessionId: session.id,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  console.log(req.session.user);
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.getCheckoutSuccess = (req, res, next) => {
  let fetchedUser;
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      fetchedUser = user;
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: user.name,
          userId: user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return fetchedUser.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedUser;
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      fetchedUser = user;
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: user.name,
          userId: user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return fetchedUser.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.session.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.getInvoices = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("no order found."));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);
      debug(invoiceName);
      const pdfDoc = new pdfDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment;filename="${invoiceName}"`
      );
      pdfDoc.pipe(FS.createWriteStream(invoicePath));
      pdfDoc.pipe(res);
      pdfDoc.fontSize(26).text("Invoice", {
        underline: true,
      });
      pdfDoc.text("-----------------------");
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              " - " +
              prod.quantity +
              " x " +
              "$" +
              prod.product.price
          );
      });
      pdfDoc.text("---");
      pdfDoc.fontSize(20).text("Total Price: $" + totalPrice);
      pdfDoc.end();
    })
    .catch((err) => {
      next(err);
    });
};
