// TERCEROS
import express from 'express';
import handlebars from 'express-handlebars';
import { Server as WebSocketServer } from 'socket.io';
import config from './config/config.js';
import cookieParser from 'cookie-parser';
import { createServer } from 'node:http';
import passport from 'passport';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
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
import sessionsRouter from './routes/sessions.routes.js';
import loggerRouter from './routes/logger.routes.js';
// MIDDLEWARE
import { passportCallCurrent } from './middleware/passportCallCurrent.middleware.js';

// CONFIGURACION INICIAL EXPRESS
const app = express();
export const PORT = config.port || 8080;
// ARCHIVO STATICO
// app.use(express.static('./src/public'));
// Para manejar json las peticiones
app.use(express.json());
// Cuando envias los datos por un formulario de una vista
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// CONEXION A BASE DE DATOS MONGO
connectDBMongo();
// DOCUMENTACION SWAGGER
// definicion de la configuracion
const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentacion de API Ecommers',
      description: 'Aplicacion de Ecommers proyecto final del curso backend'
    }
  },
  // archivos donde se encuentran las explicaciones de cada ruta
  apis: [
    './docs/**/*.yaml'
  ]
};
// uso de la deficiniones
const specs = swaggerJSDoc(swaggerOptions);
// uso de swagger ui con la configuracion de swaggerjsdocs
app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// ARRANCANDO SERVER EXPRES -- SOLO SERVER HTTP
// const httpServer = app.listen(PORT | 8000, () => {
//   console.log(`Servidor up en el puerto: ${PORT}`);
// });
const httpServer = createServer(app);

// CREACION SERVIDOR PARA SOCKET
const io = new WebSocketServer(httpServer);
// MIDDELWARE SOCKET.IO
app.set('socketio', io);
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

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
// app.use('/', sessionViewsRouter);
app.use('/', passportCallCurrent('current'), viewRouter);
app.use('/chat', passportCallCurrent('current'), chatRouter);
app.use('/loggerTest', loggerRouter);

app.use('/api/carts', cartRouter);
app.use('/api/products', productsRouter);
app.use('/api/sessions', sessionsRouter);
// app.use('/api/mockingproducts', mockingRouter);

// Para los errores
app.use(errorHandler);
app.use((req, res) => {
  if (req.headers['content-type'] === 'application-json') {
    res.status(404).json({ status: 'error', messages: '404' });
  }
  res.status(404).render('errors/error404', { status: 'error', message: 'Pagina no encontrada' });
});
// ARRANCANDO SERVER EXPRES -- SOLO SERVER CON SOCKET IO

httpServer.listen(PORT, () => {
  console.log(`Servidor up en el puerto: ${config.port}`);
});
