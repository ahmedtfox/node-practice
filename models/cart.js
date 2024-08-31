const products = [];
const { json } = require("body-parser");
const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      //let cart = { products: [], totalPrice: 0 };
      let cart = [];
      if (!err) {
        cart = JSON.parse(fileContent);

        let productExist = false;
        for (let i = 0; i < cart.length; i++) {
          if (cart[i].productId === id) {
            cart[i].qty++;
            productExist = true;
            break;
          }
        }
        if (!productExist) {
          cart.push({ productId: id, qty: 1 });
        }
        fs.writeFile(p, JSON.stringify(cart), (err) => {
          if (err) {
            console.log(err, "hiii");
          }
        });
      }
    });
  }
  static deleteCartProduct(productId) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      let cart = JSON.parse(fileContent);
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].productId === productId) {
          cart.splice(i, 1);
          fs.writeFile(p, JSON.stringify(cart), (err) => {
            console.log(err);
          });
          break;
        }
      }
    });
  }
};

/*
{ "products": [{ "id": "5635", "qty": 2 }], "totalPrice": "654" } 
*/
