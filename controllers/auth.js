const Product = require("../models/product");
const Order = require("../models/order");

exports.getLogIn = (req, res, next) => {
  //const isLoggedIn = req.get("Cookie").split("=")[1];
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    pageTitle: "Loge In",
    path: "login",
  });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.redirect("/");
};
