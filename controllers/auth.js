const Product = require("../models/product");

const User = require("../models/user");

exports.getLogIn = (req, res, next) => {
  //const isLoggedIn = req.get("Cookie").split("=")[1];
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    pageTitle: "Loge In",
    path: "login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  const userId = "66f56bdf1e513353b358a15c";
  User.findById(userId)
    .then((result) => {
      req.session.isLoggedIn = true;
      req.session.user = result;
    })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.isLoggedIn = false;
  req.session.destroy((err) => {
    res.redirect("/");
  });
};
