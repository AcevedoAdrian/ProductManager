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

// import { Router } from 'express';
// import passport from 'passport';
// import {
//   renderLogin,
//   login,
//   register,
//   logout,
//   renderError,
//   renderRegister,
//   renderFeilRegister,
//   renderFeilLogin,
//   github,
//   githubcallback
// } from '../controllers/user.controller.js';

// const router = Router();

// router.get('/login', renderLogin);
// router.get('/register', renderRegister);
// router.get('/error', renderError);
// router.get('/feilRegister', renderFeilRegister);
// router.get('/failLogin', renderFeilLogin);

// router.get('/logout', logout);
// router.post('/login', passport.authenticate('login', {
//   failureRedirect: '/auth/failLogin'
// }), login);
// router.post('/register', passport.authenticate('register', {
//   failureRedirect: '/auth/feilRegister'
// }), register);

// // Rutas para autentificacion por github
// router.get(
//   '/github',
//   passport.authenticate('github', { scope: ['user:email'] }),
//   async (req, res) => {}
// );

// router.get('/githubcallback',
//   passport.authenticate('github', { failureRedirect: '/login' }),
//   async (req, res) => {
//     console.log('Callback: ', req.user);
//     req.session.user = req.user;
//     console.log('User session: ', req.session.user);
//     res.redirect('/');
//   }
// );

// export default router;
