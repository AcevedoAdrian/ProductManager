import { userModel } from "../dao/models/users.model.js";

const renderLogin = (req, res) => {
  res.render("auth/login");
};
const renderError = (req, res) => {
  res.render("errors/errorPage");
};
const renderRegister = (req, res) => {
  res.render("auth/register");
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ status: "error", error: "Cambos no validos" });

  const user = await userModel.findOne({ email: email });
  console.log(user);
  if (user) {
    req.session.user = user;
    res.redirect("/products");
  } else {
    res.render("auth/login", { error: "Usuario o Password incorrecto" });
  }
};
const register = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  let user = {
    first_name,
    last_name,
    email,
    password,
  };

  await userModel.create(user);
  res.redirect("/users/login");
};
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.json({ status: "error", message: "Ocurrio un error" });
    return res.json({ status: "success", message: "Cookie deleteada!" });
  });
};
const auth = (req, res, next) => {
  if (
    req.session?.user &&
    req.session.user.username === "admin@coderhouse.com"
  ) {
    return next();
  }
  return res.status(401).json({ status: "fail", message: "Auth error" });
};

export { renderLogin, renderError, renderRegister, login, register, logout };
