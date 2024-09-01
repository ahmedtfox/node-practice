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
  static deleteCartProduct(productId, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      let cart = JSON.parse(fileContent);
      let cartProducts = cart.cartProducts;
      let totalPrice = cart.totalPrice;
      for (let i = 0; i < cartProducts.length; i++) {
        const theProduct = cartProducts[i];
        if (theProduct.productId === productId) {
          cartProducts.splice(i, 1);
          if (productPrice) {
            totalPrice = totalPrice - productPrice * theProduct.qty;
          }
          cart = { cartProducts: cartProducts, totalPrice: totalPrice };
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
