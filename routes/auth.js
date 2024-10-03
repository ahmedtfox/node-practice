const express = require("express");
const { check, body } = require("express-validator");
const authController = require("../controllers/auth");
const User = require("../models/user");
const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  check("email").custom((value, { req }) => {
    return User.findOne({ email: value }).then((user) => {
      if (user) {
        return true;
      } else {
        return Promise.reject("invalid E-mail !");
      }
    });
  }),
  authController.postLogin
);

router.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("please enter a valid email.")
    .custom((value, { req }) => {
      if (value === "ahmed2@gmail.com") {
        throw new Error("This Email address is forbidden");
      }
      return true;
    }),
  check("email").custom((value, { req }) => {
    return User.findOne({ email: value }).then((user) => {
      if (user) {
        console.log("user already exist");
        return Promise.reject(
          "E-mail exists already, please pick another one."
        );
      }
    });
  }),
  check("password", "please enter a password with 5 length and Alphanumeric.")
    .isLength({ min: 5 })
    .isAlphanumeric("en-US"),
  check("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("password not match");
    }
    return true;
  }),
  authController.postSignup
);
// aa5ss5dd
router.post("/logout", authController.postLogout);

router.get("/reset/:resetToken", authController.getNewPassword);
router.post("/reset-password", authController.postNewPassword);

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

module.exports = router;

/*
var email = {
  body: {
    name: "John Appleseed",
    intro:
      "You have received this email because a password reset request for your account was received.",
    action: {
      instructions: "Click the button below to reset your password:",
      button: {
        color: "#DC4D2F",
        text: "Reset your password",
        link: "https://mailgen.js/reset?s=b350163a1a010d9729feb74992c1a010",
      },
    },
    outro:
      "If you did not request a password reset, no further action is required on your part.",
  },
};

email = {
  name: "",
  to: "",
  emailType: "",
  link: "",
};
 */
