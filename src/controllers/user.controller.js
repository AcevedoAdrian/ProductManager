
const renderLogin = (req, res) => {
  res.render('sessions/login');
};

const renderRegister = (req, res) => {
  res.render('sessions/register');
};

const renderFeilRegister = (req, res) => {
  res.status(401).json({ status: 'error', message: 'Error al registrar usuario' });
};
const renderFeilLogin = (req, res) => {
  res.status(401).json({ status: 'error', message: 'Error al loguear' });
};

const register = async (req, res) => {
  console.log(req);
  console.log(req.message);
  res.redirect('/sessions/login');
};
const login = async (req, res) => {
  res.redirect('/products');
};

const github = (req, res) => {
  console.log('Hola');
};
const githubcallback = (req, res) => {
  req.sesion.user = req.user;
  res.redirect('/products');
};
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ status: 'error', message: 'Ocurrio un error' });
    }
    res.redirect('/sessions/login');
  });
};
const renderError = (req, res) => {
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
  renderLogin,
  renderError,
  renderRegister,
  login,
  register,
  logout,
  renderFeilRegister,
  renderFeilLogin,
  github,
  githubcallback
};
