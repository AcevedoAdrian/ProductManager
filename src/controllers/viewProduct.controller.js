import ProductManager from "../services/ProductManager.js";

const productManager = new ProductManager("./ProductManager.json");

const renderAllProducts = async (req, res) => {
  const products = await productManager.getAllProductos();
  res.render("products", { products });
};

const renderRealTimeAllProducts = async (req, res) => {
  const products = await productManager.getAllProductos();
  console.log(req.body);
  res.render("realTimeProducts", { products });
};

export { renderAllProducts, renderRealTimeAllProducts };
