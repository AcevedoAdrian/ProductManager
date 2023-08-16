import mongoose from 'mongoose';
import config from './config.js';
export const connectDBMongo = async () => {
  try {
    mongoose.set('strictQuery', false);
    const db = await mongoose.connect(config.mongoURL, {
      dbName: config.database,
      useUnifiedTopology: true
    });
    console.log('Base de datos conectada!!');

    const url = `${db.connection.host}:${db.connection.port}`;
    console.log(`MongoDB conectado en: ${url}`);
  } catch (err) {
    console.log(err.message);
  }
};
