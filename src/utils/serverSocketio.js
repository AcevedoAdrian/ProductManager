
import messageModel from '../models/messages.model.js';

export const serverSocketio = (io) => {
  // CONEXION SOCKET.IO
  io.on('connection', async (socket) => {
    console.log('conectado');
    // LITADODO CHAT
    const messages = (await messageModel.find()) ? await messageModel.find() : [];
    socket.emit('cargarMensaje', messages);
    socket.on('crearMessage', (data) => {
      console.log({ data });
      messages.push(data);
      messageModel.create(messages);
      io.emit('cargarMensaje', messages);
    });
    // CON CONTROLLER QUE NO ANDA POQUE NO LE ENVIA EL EVENTO EL CONTROLLER
    // socket.on('renderFirst', (messages) => {
    //   socket.emit('cargarMensaje', messages);
    //   socket.on('crearMessage', (data) => {
    //     console.log({ data });
    //     messages.push(data);
    //     messageModel.create(messages);
    //     io.emit('cargarMensaje', messages);
    //   });
    // });

    // ACTUALIZACION LISTA PRODUCTOS
    socket.on('productList', (data) => {
      io.emit('updateProducts', data);
    });
  });
};
