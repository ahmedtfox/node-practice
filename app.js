const { text, buffer } = require("stream/consumers");

const { error } = require("console");

const express = require("express");
const app = express();
const path = require("path");

// ejs
app.set("view engine", "ejs");
app.set("views", "views");
// Data Base
const mongoConnect = require("./util/database.js").mongoConnect;
const User = require("./models/user.js");

const admin = require("./routes/admin"); // order of importing doesn't matter
const shop = require("./routes/shop");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded());

const productsController = require("./controllers/error");
const ObjectId = require("mongodb").ObjectId;

app.use(express.static(path.join(__dirname, "public"))); //76. Serving Files Statically

app.use((req, res, next) => {
  const userId = "66f00c9cbeb7d244592e0e62";
  User.findById(userId)
    .then((user) => {
      req.user = user;
      /* 
      console.log("///////".repeat(20));
      console.log(req.user._id);
      console.log("///////".repeat(20)); 
      */
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use(admin);
app.use(shop);
// order of using the routes matter

// it doesn't matter because we use get

//app.use(productsController.page404);

mongoConnect(() => {
  app.listen(3000);
});
