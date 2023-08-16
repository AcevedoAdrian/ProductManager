import { Router } from 'express';
import {
  createCartController,
  getCartByIDController,
  addProductsToCartController,
  updateQuantityCartAndProductController,
  deleteProductForCartController,
  deleteProductSelectCartController,
  updateDataProductCartController
} from '../controllers/cart.controller.js';

const router = Router();

router.post('/', createCartController);
router.post('/:cid/product/:pid', addProductsToCartController);
router.get('/:cid', getCartByIDController);
router.put('/:cid/product/:pid', updateQuantityCartAndProductController);
router.put('/:cid', updateDataProductCartController);
router.delete('/:cid', deleteProductForCartController);
router.delete('/:cid/product/:pid', deleteProductSelectCartController);

export default router;
