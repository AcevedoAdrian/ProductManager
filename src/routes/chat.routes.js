import express from "express";
import messageModel from "../dao/models/messages.model.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const messages = await messageModel.find().lean().exec();

    req.io.emit("saludar", messages);
    res.render("chat", { messages });
  } catch (error) {
    res.status(500).json({ status: "success", message: error.message });
  }
});

router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const message = await messageModel.create(req.body);
    res.status(200).json({ status: "successs", payload: message });
  } catch (error) {
    res.status(500).json({ status: "success", message: error.message });
  }
  res.render("chat", {});
});

export default router;
