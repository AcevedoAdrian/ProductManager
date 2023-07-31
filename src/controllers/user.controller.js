import { userModel } from '../dao/models/users.model.js';
import { createHash, isValidPassword } from '../utils.js';

const renderLogin = (req, res) => {
  res.render('auth/login');
};
const renderError = (req, res) => {
  res.render('errors/errorPage');
};
const renderRegister = (req, res) => {
  res.render('auth/register');
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log({password});
  if (!email || !password) {
    return res
      .status(401)
      .json({ status: "error", error: "Cambos no validos" });
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    // res.render('auth/login', { error: 'Usuario o Password incorrecto' });
    res
      .status(403)
      .render("auth/login", { error: "Usuario o Password incorrecto" });
  } 
  
  if(!isValidPassword(user, password)) {
    // res.render('auth/login', { error: 'Usuario o Password incorrecto' });
    res.status(403).render("auth/login", { error: "Usuario o Password incorrecto" });
  } 
  req.session.user = user;
  res.redirect("/products");
};
const register = async (req, res) => {
  try {
    let role = '';
    const { first_name, last_name, age, email, password } = req.body;
    if (!first_name, !last_name, !age, !email, !password) {
      return res
        .status(401)
        .json({ status: 'error', message: 'No se aceptan campos vacios' });
    }
    if (password.length < 4) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Password muy corto' });
    }
    email === 'admin@coderhouse.com' && password === 'Cod3r123' ? role = 'admin' : role = 'usuario';
    const user = {
      first_name, last_name, age, email, role, password: createHash(password)
    };

    await userModel.create(user);
    res.redirect('/auth/login');
  } catch (error) {
    return res.status(500).json({ status: 'error', message: `Error al REGISTRAR usuario: ${error.message}` });
  }
};
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err){ 
      return res.status(400).json({ status: 'error', message: 'Ocurrio un error' });
    }
    return res.json({ status: 'success', message: 'Cookie deleteada!' });
  });
};

export { renderLogin, renderError, renderRegister, login, register, logout };
