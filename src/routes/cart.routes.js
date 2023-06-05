import { Router } from "express";
import { getAllProducts } from "../controllers/product.controller.js";
// app.get("/", async (req, res) => {
//   res.send("<h1>Hola desde Backend E-commerce</h1>");
// });

// app.get("/products/:pid", async (req, res) => {
//   let idProduct = +req.params.pid;
//   let productByID = await product.getProductosByID(idProduct);
//   try {
//     res.send(productByID ?? `No se encontro prudcto con el id ${idProduct}`);
//   } catch (error) {
//     res.send(error);
//   }
// });
const router = Router();
router.get("/", getAllProducts);
export default router;
