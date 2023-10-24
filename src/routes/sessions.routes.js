import passport from 'passport';
import { Router } from 'express';

import {
  loginController,
  registerController,
  forgetPasswordController,
  verifyTokenController,
  resetPasswordController,
  logoutController,
  githubcallback,
  viewFeilLoginController,
  viewFeilRegisterController
} from '../controllers/sessions.controller.js';
import { authorization } from '../middleware/authorization.middleware.js';
import { passportCallCurrent } from '../middleware/passportCallCurrent.middleware.js';
import { UserService } from '../services/users.services.js';

const router = Router();
// RESGISTRAR USUARIO
router.post('/register', passportCallCurrent('register'), registerController);
// LOGIN
router.post('/login', passportCallCurrent('login'), loginController);
// CERRAR SESION
router.get('/logout', logoutController);
// Current
router.get('/current',
  passportCallCurrent('current'),
  authorization(['ADMIN']),
  (req, res) => {
    if (!req.user) {
      // Si no hay usuario autenticado, retornar un mensaje de error
      return res.status(401).json({ status: 'error', error: 'No user with an active session' });
    }
    // Si hay un usuario autenticado, retornar los datos del usuario en el payload
    res.status(200).json({ status: 'success', payload: req.user });
  });

router.get('/failregister', viewFeilRegisterController);

router.get('/faillogin', viewFeilLoginController);

// github
// Rutas para autentificacion por github
router.get('/github',
  passport.authenticate('github', { session: false, scope: ['user:email'] }),
  async (req, res) => { }
);

router.get('/githubcallback',
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  githubcallback
);

// Restablecer la contrasena
router.post('/forget-password', forgetPasswordController);

router.get('/verify-token/:token', verifyTokenController);

router.post('/reset-password/:user', resetPasswordController);

router.get('/premium/:uid', async (req, res) => {
  try {
    const user = await UserService.findById(req.params.uid);
    await UserService.update(req.params.uid, { role: user.role === 'user' ? 'premium' : 'user' });
    res.json({ status: 'success', message: 'Se ha actualizado el rol del usuario' });
  } catch (err) {
    res.json({ status: 'error', error: err.message });
  }
});

export default router;
