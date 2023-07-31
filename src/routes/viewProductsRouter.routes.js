import { Router } from 'express';
import {
  renderAllProducts,
  renderRealTimeAllProducts,
  viewProductById,
  viewCartByID
} from '../controllers/viewProduct.controller.js';
import { auth } from '../middleware/auth.js';
const router = Router();

router.get('/products', auth, renderAllProducts);
router.get('/realTimeProducts', renderRealTimeAllProducts);
router.get('/product/:pid', viewProductById);
router.get('/carts/:cid', viewCartByID);

export default router;
