const express = require("express");
const { check } = require("express-validator");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);

router.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("please enter a valid email.")
    .custom((value, { req }) => {
      if (value === "ahmed2@gmail.com") {
        throw new Error("This Email address is forbidden");
      }
    }),
  authController.postSignup
);

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
