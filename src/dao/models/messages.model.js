import mongoose from "mongoose";

const messageShema = new mongoose.Schema({
  user: { type: String, requided: true },
  message: { type: String, requided: true },
});

mongoose.set("strictQuery", false);
const messageModel = mongoose.model("messages");

export default messageModel;
