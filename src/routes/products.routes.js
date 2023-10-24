import { Router } from 'express';
import uploadMiddleware from '../middleware/multer.middleware.js';
import { authorization } from '../middleware/authorization.middleware.js';
import {
  getAllProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController
} from '../controllers/product.controller.js';

const router = Router();
router.get('/', authorization(['USER', 'ADMIN', 'PREMIUM']), getAllProductsController);
router.get('/:pid', authorization(['USER', 'ADMIN']), getProductByIdController);
router.post('/', authorization(['ADMIN', 'PREMIUM']), uploadMiddleware, createProductController);
router.put('/:pid', authorization(['ADMIN', 'PREMIUM']), updateProductController);
router.delete('/:pid', authorization(['ADMIN', 'PREMIUM']), deleteProductController);
export default router;
