const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const mailer = require("../util/mailer");
exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((isPasswordCorrect) => {
          if (isPasswordCorrect) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            //sendEmail();
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or password.");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  //const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmedPassword = req.body.confirmPassword;
  if (!email || !password) {
    //console.log(!email || !password);
    return res.redirect("/signup");
  }
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        console.log("user already exist");
        req.flash("error", "E-mail exists already, please pick another one.");
        return res.redirect("/signup");
      }

      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const newUser = new User({
            name: "name",
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return newUser.save();
        })
        .then((result) => {
          return res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  let theUser;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "there is no user with that email");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 1 * 60 * 60 * 1000;
        theUser = user;
        return user
          .save()
          .then((result) => {
            return theUser;
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .then((user) => {
        email = {
          name: user.name,
          to: theUser.email,
          type: "ResetPassword",
          link: `http://localhost:3000/reset/${theUser.resetToken}`,
        };
        mailer.sendEmail(email);
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
