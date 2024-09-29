const Product = require("../models/product");
const Order = require("../models/order");

exports.getLogIn = (req, res, next) => {
  const isLoggedIn = req.get("Cookie").split("=")[1];
  console.log(isLoggedIn);
  res.render("auth/login", {
    pageTitle: "Loge In",
    path: "login",
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader("Set-Cookie", "loggedIn=true");
  res.redirect("/");
};
