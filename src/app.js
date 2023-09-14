// TERCEROS
import express from 'express';
import handlebars from 'express-handlebars';
import { Server as WebSocketServer } from 'socket.io';
import config from './config/config.js';
import cookieParser from 'cookie-parser';
import { createServer } from 'node:http';
import passport from 'passport';
// PROPIOS
import { connectDBMongo } from './config/db.js';
import __dirname from './utils.js';
import initializePassport from './config/passport.config.js';
import errorHandler from './middleware/error.middleware.js';
// RUTAS
import productsRouter from './routes/products.routes.js';
import cartRouter from './routes/carts.routes.js';
import chatRouter from './routes/chat.routes.js';
import viewRouter from './routes/view.routes.js';
import users from './routes/users.routes.js';
import mockingRouter from './routes/mocking.routes.js';
// CONFIGURACION INICIAL EXPRESS
const app = express();

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
app.use(cookieParser(config.cookiePrivateKey));
initializePassport();
app.use(passport.initialize());
// app.use(passport.session());

// RUTAS
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/api/mockingproducts', mockingRouter);
app.use('/sessions', users);
app.use('/chat', chatRouter);
app.use('/', viewRouter);
// Para los errores
app.use(errorHandler);
// app.use((req, res) => {
//   if (req.headers === 'application-json') {
//     res.status(404).json({ status: 'error', messages: '4004' });
//   }
//   res.status(404).render('errors/erros', { error: '404' });
// });
// ARRANCANDO SERVER EXPRES -- SOLO SERVER CON SOCKET IO
httpServer.listen(config.port || 8000, () => {
  console.log(`Servidor up en el puerto: ${config.port}`);
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
