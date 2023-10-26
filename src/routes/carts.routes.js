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
router.get('/:cid', getCartByIDController);
router.put('/:cid', updateDataProductCartController);
router.delete('/:cid', deleteProductForCartController);
router.post('/:cid/product/:pid', addProductsToCartController);
router.put('/:cid/product/:pid', updateQuantityCartAndProductController);
router.delete('/:cid/product/:pid', deleteProductSelectCartController);
router.post('/:cid/purchase', finishBuyCartController);
export default router;
