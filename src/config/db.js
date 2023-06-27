import mongoose from "mongoose";

export const connectDBMongo = async () => {
  try {
    const db = await mongoose.connect(process.env.DATABASE);
    console.log("Base de datos conectada!!");

    const url = `${db.connection.host}:${db.connection.port}`;
    console.log(`MongoDB conectado en: ${url}`);
  } catch (err) {
    console.log(err.message);
  }
};
