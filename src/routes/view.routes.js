import { Router } from 'express';
import { authorization } from '../middleware/authorization.middleware.js';
import {
  viewAllProductsController,
  viewRealTimeAllProductsController,
  viewProductByIdController,
  viewCartByIDController
} from '../controllers/view.controller.js';

const router = Router();

router.get('/', authorization(['USER', 'ADMIN']), viewAllProductsController);
router.get('/:pid', authorization(['USER', 'ADMIN']), viewProductByIdController);
router.get('/realtimeproducts', authorization(['ADMIN']), viewRealTimeAllProductsController);
router.get('/carts/:cid', authorization(['USER', 'ADMIN']), viewCartByIDController);

export default router;
