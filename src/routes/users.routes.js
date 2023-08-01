import { Router } from 'express';
import passport from 'passport';
import {
  renderLogin,
  login,
  register,
  logout,
  renderError,
  renderRegister,
  renderFeilRegister,
  renderFeilLogin
} from '../controllers/user.controller.js';

const router = Router();

router.get('/login', renderLogin);
router.get('/register', renderRegister);
router.get('/error', renderError);
router.get('/feilRegister', renderFeilRegister);
router.get('/failLogin', renderFeilLogin);

router.get('/logout', logout);
router.post('/login', passport.authenticate('login', {
  failureRedirect: 'auth/failLogin'
}), login);
router.post('/register', passport.authenticate('register', {
  failureRedirect: 'auth/failRegister'
}), register);

export default router;
