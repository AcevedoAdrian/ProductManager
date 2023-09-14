import { Router } from 'express';
import {
  createCartController,
  getCartByIDController,
  addProductsToCartController,
  updateQuantityCartAndProductController,
  deleteProductForCartController,
  deleteProductSelectCartController,
  updateDataProductCartController,
  finishBuyCartController
} from '../controllers/cart.controller.js';

const router = Router();

router.post('/', createCartController);
router.post('/:cid/product/:pid', addProductsToCartController);
router.get('/:cid', getCartByIDController);
router.put('/:cid/product/:pid', updateQuantityCartAndProductController);
router.put('/:cid', updateDataProductCartController);
router.delete('/:cid', deleteProductForCartController);
router.delete('/:cid/product/:pid', deleteProductSelectCartController);
router.delete('/:cid/purchase', finishBuyCartController);
export default router;
