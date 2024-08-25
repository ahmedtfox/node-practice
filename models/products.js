const products = [];
const { json } = require("body-parser");
const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cd) => {
  fs.readFile(p, (err, fileContent) => {
    // it has to be arrow function
    const data = fileContent;
    if (err) {
      cd([]);
    } else {
      if (data.length === 0) {
        cd([]);
      } else {
        cd(JSON.parse(data));
      }
    }
  });
};

module.exports = class Product {
  constructor(title, imageURL, description, price) {
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = price;
  }
  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cd) {
    getProductsFromFile((products) => {
      cd(products);
    });
  }
};
/* 
new Uint8Array([]) 
*/
