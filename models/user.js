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
  addToCart(product) {
    //const cartProduct = this.cart.items.findIndex;
    const productsInfo = { productId: new ObjectId(product._id), quantity: 1 };
    const updatedCart = { items: [productsInfo] };
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
