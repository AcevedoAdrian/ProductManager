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
  renderFeilLogin,
  github,
  githubcallback
} from '../controllers/user.controller.js';

const router = Router();

router.get('/login', renderLogin);
router.get('/register', renderRegister);
router.get('/error', renderError);
router.get('/feilRegister', renderFeilRegister);
router.get('/failLogin', renderFeilLogin);

router.get('/logout', logout);
router.post('/login', passport.authenticate('login', {
  failureRedirect: '/auth/failLogin'
}), login);
router.post('/register', passport.authenticate('register', {
  failureRedirect: '/auth/feilRegister'
}), register);

// Rutas para autentificacion por github
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  async (req, res) => {}
);

router.get('/githubcallback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  async (req, res) => {
    console.log('Callback: ', req.user);
    req.session.user = req.user;
    console.log('User session: ', req.session.user);
    res.redirect('/');
  }
);

export default router;
