import mongoose from 'mongoose';

const messageShema = new mongoose.Schema({
  user: { type: String, requided: true }, // correo
  message: { type: String, requided: true } // mensaje
});

mongoose.set('strictQuery', false);
const messageModel = mongoose.model('messages', messageShema);

export default messageModel;
