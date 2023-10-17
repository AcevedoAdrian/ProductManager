import crypto from 'node:crypto';
import config from '../config/config.js';
import { UserService } from '../services/users.services.js';
// const viewLoginController = (req, res) => {
//   res.render('sessions/login');
// };

// const viewRegisterController = (req, res) => {
//   res.render('sessions/register');
// };

const viewFeilRegisterController = (req, res) => {
  // res.status(401).json({ status: 'error', message: 'Error al registrar usuario' });
  console.log('Failed Register Strategi');
  res.json({ error: 'failed' });
};
const viewFeilLoginController = (req, res) => {
  console.log(req._passport);
  console.log('Failed Register Strategi');
  res.json({ satatus: 'error', message: '/failed' });
};

const registerController = async (req, res) => {
  res.redirect('/');
};
const loginController = async (req, res) => {
  if (!req.user) {
    return res.status(400).send({ status: 'error', error: 'Credencial invalida' });
  }
  // guardo el toque que tengo almacenado en el user que me mando desde passport en la cookie de forma firmada
  res.cookie(
    config.jwtNameCookie,
    req.user.token,
    {
      signed: true
      // httpOnly: true //para que no sean accedidas por medio de codigo ajeno en una peticion
    }
  )
    .redirect('/products');
  // res.send({ status: 'success', payload: req.user });
};

const githubcallback = (req, res) => {
  // console.log('Callback: ', req.authInfo);
  res.cookie(
    config.jwtNameCookie,
    req.user.token,
    {
      signed: true
      // httpOnly: true //para que no sean accedidas por medio de codigo ajeno en una peticion
    }
  )
    .redirect('/sessions/current');
};

const logoutController = (req, res) => {
  res.clearCookie(config.jwtNameCookie).redirect('/');
};

const viewErrorController = (req, res) => {
  res.render('errors/errorPage');
};

const forgetPasswordController = async (req, res) => {
  const email = req.body.email;
  const user = await UserService.findOne({ email });
  if (!user) {
    return res.status(404).json({ status: 'error', error: 'Usuario no encontrado' });
  }
  // const token = generateRandomString(16);
  const token = crypto.randomBytes(16).toString('hex').toUpperCase;
  await UserPasswordModel.create({ email, token });
  const mailerConfig = {
    service: 'gmail',
    auth: { user: config.nodemailer.user, pass: config.nodemailer.pass }
  };
  const transporter = nodemailer.createTransport(mailerConfig);
  const message = {
    from: config.nodemailer.user,
    to: email,
    subject: '[Coder e-comm API] Reset your password',
    html: `<h1>[Coder e-comm API] Reset your password</h1><hr />You have asked to reset your password. You can do it here: <a href="http://${req.hostname}:${PORT}/reset-password/${token}">http://${req.hostname}:${PORT}/reset-password/${token}</a><hr />Best regards,<br><strong>The Coder e-comm API team</strong>`
  };
  try {
    await transporter.sendMail(message);
    res.json({ status: 'success', message: `Email successfully sent to ${email} in order to reset password` });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
};

export {
  // viewLoginController,
  viewErrorController,
  // viewRegisterController,
  loginController,
  registerController,
  logoutController,
  viewFeilRegisterController,
  viewFeilLoginController,
  githubcallback
};
