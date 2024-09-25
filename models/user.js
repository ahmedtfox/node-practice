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
  addToCArt(product) {
    const cartProduct = this.cart.items.findIndex;
    product.quantity = 1;
    const updatedCart = { items: [product] };
    const db = getDB();
    return db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: { cart: updatedCart } })
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
