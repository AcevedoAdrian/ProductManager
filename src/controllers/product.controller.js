import ProductManager from "../services/ProductManager.js";

const product = new ProductManager("ProductManager.json");

const getAllProducts = async (req, res) => {
  let productByLimit = req.query.limit ?? false;
  let prodcutAll = await product.getProductos();
  try {
    if (productByLimit) {
      let limit = +productByLimit;
      res.status(200).send(prodcutAll.slice(0, limit));
    } else {
      res.status(200).json({ prodcutAll });
    }
  } catch (error) {
    res.send(error);
  }
};

export { getAllProducts };
