import { Router } from 'express';
import uploadMiddleware from '../middleware/multer.js';
import {
  getAllProducts,
  getProductById,
  saveProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';

const router = Router();
router.get('/', getAllProducts);
router.get('/:pid', getProductById);
router.post('/', uploadMiddleware, saveProduct);
router.put('/:pid', updateProduct);
router.delete('/:pid', deleteProduct);
export default router;
