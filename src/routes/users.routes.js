import { Router } from 'express';
import {
  renderLogin,
  login,
  register,
  logout,
  renderError,
  renderRegister
} from '../controllers/user.controller.js';

const router = Router();

router.get('/login', renderLogin);
router.get('/register', renderRegister);
router.get('/error', renderError);

router.get('/logout', logout);
router.post('/login', login);
router.post('/register', register);

export default router;
