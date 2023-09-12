import passport from 'passport';
import { Router } from 'express';
import {
  loginController,
  registerController,
  viewRegisterController,
  viewLoginController,
  logoutController,
  githubcallback,
  viewFeilLoginController,
  viewFeilRegisterController
} from '../controllers/users.controller.js';
import { authorization } from '../middleware/authorization.js';
import { passportCallCurrent } from '../middleware/passportCallCurrent.js';

const router = Router();

router.get('/register', viewRegisterController);

router.post('/register', passportCallCurrent('register'), registerController);

router.get('/failregister', viewFeilRegisterController);

router.get('/login', viewLoginController);

router.post('/login', passportCallCurrent('login'), loginController);

router.get('/faillogin', viewFeilLoginController);

// Cerrar Session
router.get('/logout', logoutController);

// Current
router.get('/current', passportCallCurrent('current'), authorization('admin'), (req, res) => {
  if (!req.user) {
    // Si no hay usuario autenticado, retornar un mensaje de error
    return res.status(401).json({ status: 'error', error: 'No user with an active session' });
  }
  // Si hay un usuario autenticado, retornar los datos del usuario en el payload
  res.status(200).json({ status: 'success', payload: req.user });
});

// github
// Rutas para autentificacion por github
router.get(
  '/github',
  passport.authenticate('github', { session: false, scope: ['user:email'] }),
  async (req, res) => { }
);

router.get(
  '/githubcallback',
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  githubcallback
);

export default router;
