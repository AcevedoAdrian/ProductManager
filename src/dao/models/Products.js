import mongoose from "mongoose";
const productCollection = "Products";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: Int,
  thumbnail: {
    type: String,
    required: true,
  },
  code: {
    type: Int,
    required: true,
  },
  stock: {
    type: Int,
    required: true,
  },
});

const Products = mongoose.model(productCollection, productSchema);
export default Products;
