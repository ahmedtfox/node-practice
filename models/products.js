const mongodb = require("mongodb");
const getDB = require("../util/database").getDB;

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }
  save() {
    const db = getDB();
    return db
      .collection("products")
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  update() {
    const db = getDB();
    return db
      .collection("products")
      .updateOne({ _id: this._id }, { $set: this })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static fetchAll() {
    const db = getDB();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(productId) {
    const db = getDB();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(productId) })
      .next()
      .then((product) => {
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static deleteById(productId) {
    const db = getDB();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(productId) })
      .then((result) => {
        //console.log(result);
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Product;
