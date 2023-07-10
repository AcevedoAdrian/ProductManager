import mongoose from "mongoose";
import Products from './products.model.js'
const cartSchema = mongoose.Schema({
  products: {
    type: [
      // Esto es un subdocumento
      {
        _id: false,
        product: {
          product: mongoose.ObjectId,
          // ref: Products,
          // required: [true, "Producto Requerido"],
        },
        quantity: Number,
      },
    ],
    default: [],
  },
});

// Middelware que permite hacer el populate cuando hacemos un findOne
// cartSchema.pre("findOne", function () {
//   this.populate("products.product");
// });

mongoose.set("strictQuery", false);

const cartModel = mongoose.model("Carts", cartSchema);

export default cartModel;
