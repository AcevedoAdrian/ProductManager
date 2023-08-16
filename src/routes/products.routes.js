import { Router } from 'express';
import uploadMiddleware from '../middleware/multer.js';
import {
  getAllProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController
} from '../controllers/product.controller.js';

const router = Router();
router.get('/', getAllProductsController);
router.get('/:pid', getProductByIdController);
router.post('/', uploadMiddleware, createProductController);
router.put('/:pid', updateProductController);
router.delete('/:pid', deleteProductController);
export default router;
