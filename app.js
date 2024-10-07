const express = require("express");
const app = express();
const path = require("path");
const debug = require("./util/debug.js").printOut;
// ejs
app.set("view engine", "ejs");
app.set("views", "views");

// Data Base
const mongoose = require("mongoose");
const mongodb_URL =
  "mongodb+srv://ahmedmongo:rD=,98Hf^4umZQ}&>@cluster0.arm5u.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0";

const User = require("./models/user.js");

const admin = require("./routes/admin"); // order of importing doesn't matter

// session
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({ uri: mongodb_URL, collection: "sessions" });

//connect-flash
const flash = require("connect-flash");

//CSRF
const csrf = require("csurf");
const csrfProtection = csrf();

const auth = require("./routes/auth.js");
const shop = require("./routes/shop");
const bodyParser = require("body-parser");
const multer = require("multer");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      /*   path.join(__dirname, "images") // Correctly resolve path using path.join */
      "images"
    );
  },
  filename: (req, file, cb) => {
    // Replace colons in ISO string for filename compatibility
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Initialize Multer middleware
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use(bodyParser.urlencoded({ extended: false }));

const errorPage = require("./controllers/error");

app.use(express.static(path.join(__dirname, "public"))); //76. Serving Files Statically

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  //throw new Error("rtttt");

  if (req.session.isLoggedIn === undefined) {
    req.session.isLoggedIn = false;
  }
  if (req.session.user === undefined) {
    return next();
  }
  const userId = req.session.user._id;
  User.findById(userId)
    .then((result) => {
      if (!result) {
        return next();
      }
      req.session.isLoggedIn = true;
      req.user = result;

      return next();
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
});

app.use(admin);
app.use(shop);
app.use(auth);
// order of using the routes matter

// it doesn't matter because we use get

app.get("/500", errorPage.get500);

app.use(errorPage.get404);
app.use((error, req, res, next) => {
  // res.httpStatusCode(error.httpStatusCode);
  //res.redirect("/500");
  console.log(error);
  res.status(500).render("500", {
    pageTitle: "Error",
    path: "/404",
    isAuthenticated: req.session.isLoggedIn,
  });
});
debug("");
mongoose
  .connect(mongodb_URL)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

/* 

rD=,98Hf^4umZQ}&>


mongodb+srv://ahmedmongo:rD=,98Hf^4umZQ}&>@cluster0.arm5u.mongodb.net/

*/
