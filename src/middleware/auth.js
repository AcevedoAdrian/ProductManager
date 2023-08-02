const auth = (req, res, next) => {
  if (
    req.session?.passport?.user
  ) {
    return next();
  }
  return res.status(403).json({ status: 'error', message: 'Usuario no autorizado' });
};

export {
  auth
};
