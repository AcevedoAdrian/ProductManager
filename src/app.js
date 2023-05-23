import ProductManager from "./ProductManager.js";
import express from "express";

const product = new ProductManager("./src/ProductManager.json");
await product.addProduct("Nike", "Zapatilla Air", 100, "Sin imagen", 2301, 5);
await product.addProduct("Puma", "Zapatilla Roja", 200, "Sin imagen", 1235, 1);
await product.addProduct("Gola", "Zapatialla", 1500, "Sin imagen", 1255, 2);
await product.addProduct(
  "Adidas",
  "Zapatilla verde",
  200,
  "Sin imagen",
  125,
  1
);
await product.addProduct(
  "Lacoste",
  "Zapatialla Negra",
  1500,
  "Sin imagen",
  128,
  2
);
const app = express();
const PORT = 8080;

app.get("/", async (req, res) => {
  res.send("<h1>Hola desde Backend E-commerce</h1>");
});

app.get("/products/:pid", async (req, res) => {
  let idProduct = +req.params.pid;
  let productByID = await product.getProductosByID(idProduct);
  try {
    res.send(productByID ?? `No se encontro prudcto con el id ${idProduct}`);
  } catch (error) {
    res.send(error);
  }
});

app.get("/products", async (req, res) => {
  let productByLimit = req.query.limit ?? false;
  let prodcutAll = await product.getProductos();

  try {
    if (productByLimit) {
      let limit = +productByLimit;
      res.send(prodcutAll.slice(0, limit));
    } else {
      res.json({ prodcutAll });
    }
  } catch (error) {
    res.send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor up en el puerto: ${PORT}`);
});
