import mongoose from "mongoose";

const cartsCollection = "Carts";
const cartSchema = mongoose.Schema({
  products: {
    type: [
      // Esto es un subdocumento
      {
        _id: false,
        product: {
          // product: mongoose.ObjectId,
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
        },
        quantity: Number,
      },
    ],
    default: [],
  },
});

// Middelware que permite hacer el populate cuando hacemos un findOne
cartSchema.pre("findOne", function () {
  this.populate("products.product");
});

mongoose.set("strictQuery", false);

const cartModel = mongoose.model(cartsCollection, cartSchema);

export default cartModel;
