const { text, buffer } = require("stream/consumers");

const { error } = require("console");

const express = require("express");
const app = express();
const path = require("path");

/*
express-handlebars
const expressHBS = require("express-handlebars");

app.engine(
  "hbs",
  expressHBS({
    layouts: "./views/layouts",
    defaultLayout: "main-layout",
    extname: "hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", "views"); */

// ejs
app.set("view engine", "ejs");
app.set("views", "views");

const admin = require("./routes/admin"); // order of importing doesn't matter
const shop = require("./routes/shop");
const bodyParser = require("body-parser");
/* 
 set pug as an engine template 
app.set("view engine", "pug");
app.set("views", "views");
 */
app.use(bodyParser.urlencoded());

app.use(express.static(path.join(__dirname, "public"))); //76. Serving Files Statically
app.use("/admin", admin.routs);
app.use(shop); // order of using the routes matter
// it doesn't matter because we use get
app.use((req, res, next) => {
  //res.status(404).send("<h1>page note found</h1>");
  //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  res.status(404).render("404", { docTitle: "Page not found" });
});

app.listen(3000);
