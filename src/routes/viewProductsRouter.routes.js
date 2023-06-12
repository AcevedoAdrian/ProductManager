import { Router } from "express";
import {
  renderAllProducts,
  renderRealTimeAllProducts,
} from "../controllers/viewProduct.controller.js";

const router = Router();

// router.get("/", (req, res) => {
//   res.render("home", {});
// });
router.get("/", renderAllProducts);
router.get("/realTimeProducts", renderRealTimeAllProducts);

export default router;
