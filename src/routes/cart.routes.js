import { Router } from "express";
import {
  newCart,
  getCartByID,
  addProductsToCart,
  updateQuantityCartAndProduct,
  deleteProductForCart,
  deleteProductSelectCart,
  updateDataProductCart,
} from "../controllers/cart.controller.js";

const router = Router();

router.post("/", newCart);
router.post("/:cid/product/:pid", addProductsToCart);
router.get("/:cid", getCartByID);
router.put("/:cid/product/:pid", updateQuantityCartAndProduct);
router.put("/:cid", updateDataProductCart);
router.delete("/:cid", deleteProductForCart);
router.delete("/:cid/product/:pid", deleteProductSelectCart);

export default router;
