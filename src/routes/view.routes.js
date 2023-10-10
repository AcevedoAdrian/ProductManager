import { Router } from 'express';
import { authorization, privateRoutes, publicRoutes } from '../middleware/authorization.middleware.js';
import UserDTO from '../dto/user.dto.js';
import loggers from '../services/logger.js';

import {
  viewAllProductsController,
  viewRealTimeAllProductsController,
  viewProductByIdController,
  viewCartByIDController,
  getProductMockController,
  createProductMockController,
  getLoggerController,
  getTicketViewController
} from '../controllers/view.controller.js';

const router = Router();

router.get('/products', authorization(['USER', 'ADMIN']), viewAllProductsController);
router.get('/product/:pid', authorization(['USER', 'ADMIN']), viewProductByIdController);
router.get('/realtimeproducts', authorization(['ADMIN']), viewRealTimeAllProductsController);
router.get('/carts/:cid', authorization(['USER', 'ADMIN']), viewCartByIDController);
router.get('/mockingproducts', getProductMockController);
router.post('/mockingproducts', createProductMockController);
router.get('/loggerTest', getLoggerController);
router.get('/ticket/:tid', getTicketViewController);

router.get('/', privateRoutes, (req, res) => {
  res.render('sessions/login');
});
router.get('/register', privateRoutes, async (req, res) => {
  res.render('sessions/register');
});

router.get('/reset-password', (req, res) => {
  res.render('sessions/reset-password');
});

router.get('/reset-password/:token', (req, res) => {
  res.redirect(`/api/sessions/verify-token/${req.params.token}`);
});

router.get('/profile', publicRoutes, (req, res) => {
  const userDTO = new UserDTO(req.user);
  res.render('sessions/profile', userDTO);
});

export default router;
