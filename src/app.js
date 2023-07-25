// TERCEROS
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
// PROPIOS
import { connectDBMongo } from "./config/db.js";
import productsRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import chatRouter from "./routes/chat.routes.js";
import viewProductsRouter from "./routes/viewProductsRouter.routes.js";
import users from "./routes/users.routes.js";

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

// CONEXION A BASE DE DATOS MONGO
connectDBMongo();

// CREACION SERVIDOR PARA SOCKET
const io = new Server(httpserver);

// CONFIGURACION PLANTILLAS HANDLEBARS
app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

// MIDDELWARE SESSION
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE,
      dbName: process.env.NAME_DATABASE,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 15,
    }),
    secret: "esunsecreto",
    resave: true,
    saveUninitialized: true,
  })
);
// MIDDELWARE SOCKET.IO
app.use((req, res, next) => {
  req.io = io;
  next();
});
// RUTAS
app.get("/", (req, res) => res.render("index"));
app.use("/", viewProductsRouter);
app.use("/users", users);
app.use("/chat", chatRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

let messages = [];
// CONEXION SOCKET.IO
io.on("connection", (socket) => {
  // LITADODO CHAT
  socket.on("message", (data) => {
    messages.push(data);
    io.emit("logs", messages);
  });

  // ACTUALIZACION LISTA PRODUCTOS
  socket.on("productList", (data) => {
    io.emit("updateProducts", data);
  });
});
