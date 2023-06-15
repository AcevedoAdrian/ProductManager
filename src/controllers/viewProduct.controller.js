import ProductManager from "../services/ProductManager.js";

const productManager = new ProductManager("./ProductManager.json");

const renderAllProducts = async (req, res) => {
  const products = await productManager.getAllProductos();
  res.render("products", { products });
};

const renderRealTimeAllProducts = async (req, res) => {
  const products = await productManager.getAllProductos();
  res.render("realTimeProducts", { products });
};

const addRealTimeAllProducts = async (req, res) => {};

export { renderAllProducts, renderRealTimeAllProducts, addRealTimeAllProducts };
