import express from "express";
import productsRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";

const app = express();
const PORT = 8000;
app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.listen(PORT | 8000, () => {
  console.log(`Servidor up en el puerto: ${PORT}`);
});
