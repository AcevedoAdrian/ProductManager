import { Router } from "express";
import {
  newCart,
  getCartByID,
  addProductsToCart,
} from "../controllers/cart.controller.js";

const router = Router();

router.post("/", newCart);
router.get("/:cid", getCartByID);
router.post("/:cid/product/:pid", addProductsToCart);

export default router;
