const { text, buffer } = require("stream/consumers");

const { error } = require("console");

const express = require("express");
const app = express();

app.use((req, res, next) => {
  console.log("hi it's middleware 1");
  next(); // Allows the request to continue to the next middleware in line.
});

app.use((req, res, next) => {
  console.log("hi it's middleware 2");
  res.send("<h1>hello from Express!</h1>");
});

app.listen(3000);