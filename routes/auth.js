const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogIn);

router.post("/login", authController.postLogin);

module.exports = router;

/* Session {
    cookie: {
      path: '/',
      _expires: null,
      originalMaxAge: null,
      httpOnly: true,
      partitioned: null,
      priority: null,
      secure: null,
      domain: null,
      sameSite: null
    },
    isLoggedIn: true,
    user: {
      cart: { items: [] },
      _id: new ObjectId('66f56bdf1e513353b358a15c'),
      email: 'ahmed@gmail.com',
      __v: 1,
      name: 'ahmed'
    }
  } */
