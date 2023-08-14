import passport from 'passport';

export const invitado = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, { session: false }, function (err, user, info) {
      // console.log(info);
      if (err) return next(err);
      req.user = user || null;
      next();
    })(req, res, next);
  };
};
