import { Router } from 'express';
import { passportCallCurrent } from '../middleware/passportCallCurrent.js';
import { authorization } from '../middleware/authorization.js';
import { invitado } from '../middleware/invitado.js';
import {
  viewAllProductsController,
  viewRealTimeAllProductsController,
  viewProductByIdController,
  viewCartByIDController
} from '../controllers/view.controller.js';

const router = Router();

router.get('/products', invitado('jwt'), viewAllProductsController);
router.get('/products/:pid', viewProductByIdController);
router.get('/realTimeProducts', passportCallCurrent('current'), authorization('user'), viewRealTimeAllProductsController);
router.get('/carts/:cid', viewCartByIDController);

export default router;
