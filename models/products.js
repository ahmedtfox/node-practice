const products = [];
const { json } = require("body-parser");
const fs = require("fs");
const path = require("path");
const Cart = require("../models/cart");
const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

const db = require("../util/database");

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
  //static id = 1111;
  constructor(id, title, imageURL, description, price) {
    this.Id = id;
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = price;
    // Product.id += 1;
  }
  save() {
    return db.execute(
      "INSERT INTO products(title,price,imageURL,description) VALUES(?,?,?,?)",
      [this.title, this.price, this.imageURL, this.description]
    );
  }
  static delete(productId) {
    getProductsFromFile((products) => {
      for (let i = 0; i < products.length; i++) {
        if (productId === products[i].Id) {
          const price = products[i].price;
          products.splice(i, 1);
          fs.writeFile(p, JSON.stringify(products), (err) => {
            if (!err) {
              Cart.deleteCartProduct(productId, price);
              console.log(err);
            }
          });
          return;
        }
      }
    });
  }

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }
  static findById(Id, cd) {}
};
/* 
new Uint8Array([]) 
*/
