// TERCEROS
import express from 'express';
import handlebars from 'express-handlebars';
import { Server as WebSocketServer } from 'socket.io';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { createServer } from 'node:http';
import passport from 'passport';
// PROPIOS
import { connectDBMongo } from './config/db.js';
import productsRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import chatRouter from './routes/chat.routes.js';
import viewProductsRouter from './routes/viewProductsRouter.routes.js';
import users from './routes/users.routes.js';
import __dirname from './utils.js';
import initializePassport from './config/passport.config.js';
// CONFIGURACION INICIAL EXPRESS
const app = express();

// VARIABLE DE ENTORNOS
dotenv.config({ path: '.env' });

// ARCHIVO STATICO
// app.use(express.static('./src/public'));
// Para manejar json las peticiones
app.use(express.json());
// Cuando envias los datos por un formulario de una vista
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// CONEXION A BASE DE DATOS MONGO
connectDBMongo();

// ARRANCANDO SERVER EXPRES -- SOLO SERVER HTTP
// const httpServer = app.listen(PORT | 8000, () => {
//   console.log(`Servidor up en el puerto: ${PORT}`);
// });
const httpServer = createServer(app);
// CREACION SERVIDOR PARA SOCKET
const io = new WebSocketServer(httpServer);
// MIDDELWARE SOCKET.IO
app.use((req, res, next) => {
  req.io = io;
  next();
});

// CONFIGURACION PLANTILLAS HANDLEBARS
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// MIDDELWARE SESSION

initializePassport();
app.use(passport.initialize());
// app.use(passport.session());

// RUTAS
app.get('/', (req, res) => res.render('index'));

app.use('/auth', users);
app.use('/chat', chatRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewProductsRouter);
// app.use((req, res) => {
//   if (req.headers === 'application-json') {
//     res.status(404).json({ status: 'error', messages: '4004' });
//   }
//   res.status(404).render('errors/erros', { error: '404' });
// });
// ARRANCANDO SERVER EXPRES -- SOLO SERVER CON SOCKET IO
httpServer.listen(process.env.PORT || 8000, () => {
  console.log(`Servidor up en el puerto: ${process.env.PORT}`);
});

const messages = [];
// CONEXION SOCKET.IO
io.on('connection', (socket) => {
  // LITADODO CHAT
  socket.on('message', (data) => {
    console.log({ data });
    messages.push(data);
    io.emit('logs', messages);
  });

  // ACTUALIZACION LISTA PRODUCTOS
  socket.on('productList', (data) => {
    io.emit('updateProducts', data);
  });
});
