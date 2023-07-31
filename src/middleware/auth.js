const auth = (req, res, next) => {
  console.log(`middlewares: ${req.session.user}`);
  if (
    req.session?.user &&
    req.session.user.email === 'admin@coderhouse.com'
  ) {
    return next();
  }
  return res.status(403).json({ status: 'error', message: 'Usuario no autorizado' });
};

export {
  auth
};
