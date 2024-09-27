const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  cart: {
    items: [
      {
        productId: { type: Schema.ObjectId, required: true, ref: "Product" },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  let cartProducts = this.cart.items;
  //let cartProducts = [];
  let newCart = [];
  let newQuantity = 1;
  let productExist = false;
  let productId = product._id;
  for (let i = 0; i < cartProducts.length; i++) {
    const productIndex = cartProducts[i];
    const productIndexId = productIndex.productId;
    if (productIndexId.toString() === productId.toString()) {
      const oldQuantity = productIndex.quantity;
      newQuantity = oldQuantity + 1;
      productExist = true;
      newCart = cartProducts;
      newCart[i] = {
        productId: productId,
        quantity: newQuantity,
      };
    }
  }
  if (!productExist) {
    const productsInfo = {
      productId: productId,
      quantity: newQuantity,
    };
    cartProducts.push(productsInfo);
    newCart = cartProducts;
  }
  const updatedCart = { items: newCart };

  this.cart = updatedCart;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

/* const { name } = require("ejs");

const ObjectId = require("mongodb").ObjectId;
const getDB = require("../util/database").getDB;

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart; // {items:[]}
    this._id = id ? new ObjectId(id) : null;
  }
  save() {
    const db = getDB();
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  addToCart(productId) {
    let cartProducts = this.cart.items;
    //let cartProducts = [];
    let newCart = [];
    let newQuantity = 1;
    let productExist = false;
    for (let i = 0; i < cartProducts.length; i++) {
      const productIndex = cartProducts[i];
      const productIndexId = productIndex.productId;
      if (productIndexId.toString() === productId.toString()) {
        const oldQuantity = productIndex.quantity;
        newQuantity = oldQuantity + 1;
        productExist = true;
        newCart = cartProducts;
        newCart[i] = {
          productId: new ObjectId(productId),
          quantity: newQuantity,
        };
      }
    }

    if (!productExist) {
      const productsInfo = {
        productId: new ObjectId(productId),
        quantity: newQuantity,
      };
      cartProducts.push(productsInfo);
      newCart = cartProducts;
    }
    const updatedCart = { items: newCart };
    const db = getDB();
    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } })
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getCart() {
    const db = getDB();
    const productsId = this.cart.items.map((p) => {
      return p.productId;
    });

    const productsQty = this.cart.items.map((p) => {
      return p.quantity;
    });

    return db
      .collection("products")
      .find({ _id: { $in: productsId } })
      .toArray()
      .then((products) => {
        let newProducts = [];
        for (let i = 0; i < products.length; i++) {
          newProducts.push({ ...products[i], quantity: productsQty[i] });
        }
        return newProducts;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  deleteItemFromCart(productId) {
    const updatedCart = this.cart.items.filter((item) => {
      return item.productId.toString() !== productId.toString();
    });
    console.log(updatedCart);
    const db = getDB();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCart } } }
      )
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  addOrder() {
    const db = getDB();
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            username: this.username,
          },
        };
        return db
          .collection("orders")
          .insertOne(order)
          .then((result) => {
            this.cart = [];
            return db
              .collection("users")
              .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { cart: { items: [] } } }
              )
              .then((result) => {
                return result;
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getOrders() {
    const db = getDB();
    return db
      .collection("orders")
      .find({ "user._id": new ObjectId(this._id) })
      .toArray()
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static findById(userId) {
    const db = getDB();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then((product) => {
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;
 */
