const { text, buffer } = require("stream/consumers");

const { error } = require("console");

const express = require("express");
const app = express();
const path = require("path");

const sequelize = require("./util/database");

// ejs
app.set("view engine", "ejs");
app.set("views", "views");

const admin = require("./routes/admin"); // order of importing doesn't matter
const shop = require("./routes/shop");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded());

const productsController = require("./controllers/error");

app.use(express.static(path.join(__dirname, "public"))); //76. Serving Files Statically
app.use(admin);
app.use(shop); // order of using the routes matter
// it doesn't matter because we use get
app.use(productsController.page404);

sequelize
  .sync()
  .then((result) => {
    console.log(result);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
