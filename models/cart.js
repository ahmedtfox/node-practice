const products = [];
const { json } = require("body-parser");
const fs = require("fs");
const path = require("path");
const Product = require("./products");
const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      //let cart = { products: [], totalPrice: 0 };
      if (!err) {
        let cart = JSON.parse(fileContent);
        let cartProducts = cart.cartProducts;
        let totalPrice = cart.totalPrice;
        let productExist = false;
        for (let i = 0; i < cartProducts.length; i++) {
          if (cartProducts[i].productId === id) {
            cartProducts[i].qty++;

            totalPrice = totalPrice + Number(productPrice);
            productExist = true;
            break;
          }
        }
        if (!productExist) {
          cartProducts.push({ productId: id, qty: 1 });
          totalPrice = totalPrice + Number(productPrice);
        }
        cart = { cartProducts: cartProducts, totalPrice: totalPrice };
        fs.writeFile(p, JSON.stringify(cart), (err) => {
          if (err) {
            console.log(err, "hiii");
          }
        });
      }
    });
  }

  /* 
{
    "cartProducts":[
    { "productId": "5465", "qty": 1 },
    { "productId": "216", "qty": 1 },
    { "productId": "939", "qty": 1 }
  ],
  "totalPrice":4566
}

*/
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
  static getCart(cd) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cd(null);
      } else {
        let cart = JSON.parse(fileContent);
        cd(cart);
      }
    });
  }
};

/*
{ "products": [{ "id": "5635", "qty": 2 }], "totalPrice": "654" } 
*/
