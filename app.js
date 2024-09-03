const { text, buffer } = require("stream/consumers");

const { error } = require("console");

const express = require("express");
const app = express();
const path = require("path");

// Data Base
const sequelize = require("./util/database");
const Product = require("./models/products");
const User = require("./models/user");

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

Product.belongsTo(User, { constrains: true, onDelete: "CASCADE" });
User.hasMany(Product);

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

//sync({ force: true })
sequelize
  .sync()
  .then((result) => {
    //console.log(result);

    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "ahmed", email: "ahmed@gmail.com" });
    }
    return user;
  })
  .then((user) => {
    //console.log(typeof User);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
