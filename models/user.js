const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
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

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((product) => {
    return product.productId.toString() !== productId.toString();
  });
  console.log(updatedCartItems);
  this.cart.items = updatedCartItems;
  return this.save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

userSchema.methods.getCart = function () {
  return this.populate("cart.items.productId")
    .then((user) => {
      return user.cart.items;
    })
    .catch((err) => {
      console.log(err);
    });
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save()
    .then((result) => {
      //console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongoose.model("User", userSchema);
