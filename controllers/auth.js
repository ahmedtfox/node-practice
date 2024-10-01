const User = require("../models/user");
const bcrypt = require("bcryptjs");

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
            sendEmail();
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

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail() {
  const nodemailer = require("nodemailer");
  const Mailgen = require("mailgen");
  let config = {
    service: "gmail",
    auth: {
      user: "ahmedmahfouzt@gmail.com",
      pass: "vbyektuilkzaiguk", // this password from the Gmail
    },
  };
  let transporter = nodemailer.createTransport(config);
  let mailGenerator = new Mailgen({
    theme: "default",
    product: {
      // Appears in header & footer of e-mails
      name: "shop",
      link: "http://localhost:3000/",
    },
  });

  let email = {
    body: {
      name: "Ahmed",
      intro: "Welcome to Mailgen! We're very excited to have you on board.",
      action: {
        instructions: "To get started with Mailgen, please click here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Confirm your account",
          link: "https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010",
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  // Generate an HTML email with the provided contents
  let emailBody = mailGenerator.generate(email);

  // vbyektuilkzaiguk
  let msg = {
    from: "ahmedmahfouzt@gmail.com",
    /* to: "ahmed_mahfouz2014@outlook.com", */
    to: "mahon73432@abevw.com",
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: emailBody, // html body
  };
  // send mail with defined transport object
  transporter
    .sendMail(msg)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}
