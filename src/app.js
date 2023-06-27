// TERCEROS
import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { connectDBMongo } from "./config/db.js";
import dotenv from "dotenv";
// PROPIOS
import productsRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import viewProductsRouter from "./routes/viewProductsRouter.routes.js";

// CONFIGURACION INICIAL EXPRESS
const app = express();
const PORT = 8000;

// VARIABLE DE ENTORNOS
dotenv.config({ path: ".env" });

// ARCHIVO STATICO
app.use(express.static("./src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ARRANCANDO SERVER EXPRES -- SOLO SERVER HTTP
const httpserver = app.listen(PORT | 8000, () => {
  console.log(`Servidor up en el puerto: ${PORT}`);
});

connectDBMongo();
// CREACION SERVIDOR PARA SOCKET
const io = new Server(httpserver);

// midellware
app.use((req, res, next) => {
  req.io = io;
  next();
});

// CONFIGURACION PLANTILLAS HANDLEBARS
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// RUTAS
app.get("/", (req, res) => res.render("index"));
app.use("/products", viewProductsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

io.on("connection", (socket) => {
  socket.on("productList", (data) => {
    io.emit("updateProducts", data);
  });
});
