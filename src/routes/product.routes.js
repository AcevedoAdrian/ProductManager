import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  saveProduct,
  updateProduct,
} from "../controllers/product.controller.js";

const router = Router();
router.get("/", getAllProducts);
router.get("/:pid", getProductById);
router.post("/", saveProduct);
router.put("/:pid", updateProduct);
router.delete("/:pid");
export default router;
