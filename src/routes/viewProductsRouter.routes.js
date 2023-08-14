import { Router } from 'express';
import {
  renderAllProducts,
  renderRealTimeAllProducts,
  viewProductById,
  viewCartByID
} from '../controllers/viewProduct.controller.js';
import { passportCallCurrent } from '../middleware/passportCallCurrent.js';
import { authorization } from '../middleware/authorization.js';
import { invitado } from '../middleware/invitado.js';
const router = Router();

router.get('/products', invitado('jwt'), renderAllProducts);
router.get('/realTimeProducts', passportCallCurrent('current'), authorization('admin'), renderRealTimeAllProducts);
router.get('/product/:pid', viewProductById);
router.get('/carts/:cid', viewCartByID);

export default router;
