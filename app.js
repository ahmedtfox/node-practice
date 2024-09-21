const { text, buffer } = require("stream/consumers");

const { error } = require("console");

const express = require("express");
const app = express();
const path = require("path");

// ejs
app.set("view engine", "ejs");
app.set("views", "views");
// Data Base
const mongoConnect = require("./util/database.js");

const admin = require("./routes/admin"); // order of importing doesn't matter
const shop = require("./routes/shop");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded());

const productsController = require("./controllers/error");

app.use(express.static(path.join(__dirname, "public"))); //76. Serving Files Statically

app.use((req, res, next) => {
  /*   User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    }); */
});

/* app.use(admin);
app.use(shop);  */
// order of using the routes matter

// it doesn't matter because we use get

//app.use(productsController.page404);

mongoConnect((client) => {
  console.log(client);
  app.listen(3000);
});
