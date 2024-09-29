const Product = require("../models/product");
const Order = require("../models/order");

exports.getLogIn = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Loge In",
    path: "login",
  });
};
