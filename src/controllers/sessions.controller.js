
import config from '../config/config.js';

const viewLoginController = (req, res) => {
  res.render('sessions/login');
};

const viewRegisterController = (req, res) => {
  res.render('sessions/register');
};

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
  res.redirect('/sessions/login');
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
// const login = async (req, res) => {
//   const { email, password } = req.body;
//   console.log({ password });
//   if (!email || !password) {
//     return res
//       .status(401)
//       .json({ status: 'error', error: 'Cambos no validos' });
//   }

//   const user = await userModel.findOne({ email });
//   if (!user) {
//     // res.render('sessions/login', { error: 'Usuario o Password incorrecto' });
//     res
//       .status(403)
//       .render('sessions/login', { error: 'Usuario o Password incorrecto' });
//   }

//   if (!isValidPassword(user, password)) {
//     // res.render('sessions/login', { error: 'Usuario o Password incorrecto' });
//     res.status(403).render('sessions/login', { error: 'Usuario o Password incorrecto' });
//   }
//   req.session.user = user;
//   res.redirect('/products');
// };

// const register = async (req, res) => {
//   try {
//     const { first_name, last_name, age, email, password } = req.body;
//     if ((!first_name, !last_name, !age, !email, !password)) {
//       return res
//         .status(401)
//         .json({ status: "error", message: "No se aceptan campos vacios" });
//     }
//     if (password.length < 4) {
//       return res
//         .status(401)
//         .json({ status: "error", message: "Password muy corto" });
//     }
//     email === "admin@coderhouse.com" && password === "Cod3r123"
//       ? (role = "admin")
//       : (role = "usuario");
//     const user = {
//       first_name,
//       last_name,
//       age,
//       email,
//       role,
//       password: createHash(password),
//     };

//     await userModel.create(user);
//     res.redirect("/sessions/login");
//   } catch (error) {
//     return res
//       .status(500)
//       .json({
//         status: "error",
//         message: `Error al REGISTRAR usuario: ${error.message}`,
//       });
//   }
// };

export {
  viewLoginController,
  viewErrorController,
  viewRegisterController,
  loginController,
  registerController,
  logoutController,
  viewFeilRegisterController,
  viewFeilLoginController,
  githubcallback
};
