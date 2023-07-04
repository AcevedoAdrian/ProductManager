// import ProductManager from "../dao/fileManager/ProductManager.js";
import prodctModel from "../dao/models/products.model.js";

// const productManager = new ProductManager("./ProductManager.json");

const renderAllProducts = async (req, res) => {
  // const products = await productManager.getAllProductos();
  // res.render("products", { products });
  try {
    const products = await prodctModel.find().lean().exec();
    res.render("products", { products });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

const renderRealTimeAllProducts = async (req, res) => {
  // const products = await productManager.getAllProductos();
  // res.render("realTimeProducts", { products });
  try {
    const products = await prodctModel.find().lean().exec();
    res.render("realTimeProducts", { products });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

export { renderAllProducts, renderRealTimeAllProducts };
