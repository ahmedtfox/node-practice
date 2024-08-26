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
    getProductsFromFile((products) => {
      if (this.Id === null) {
        this.Id = (Math.random() * 1000).toFixed(0);
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      } else {
        for (let i = 0; i < products.length; i++) {
          if (products[i].Id === this.Id) {
            products[i] = this;
            fs.writeFile(p, JSON.stringify(products), (err) => {
              console.log(err);
            });
          }
        }
      }
    });
  }

  static fetchAll(cd) {
    getProductsFromFile((products) => {
      cd(products);
    });
  }
  static findById(Id, cd) {
    getProductsFromFile((products) => {
      const product = products.find((p) => {
        if (p.Id === Id) {
          return true;
        }
      });
      cd(product);
    });
  }
};
/* 
new Uint8Array([]) 
*/
