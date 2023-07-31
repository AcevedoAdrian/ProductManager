import { Router } from 'express';
import { uploader } from '../utils.js';
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
router.post('/', uploader.array('file'), saveProduct);
router.put('/:pid', updateProduct);
router.delete('/:pid', deleteProduct);
export default router;
