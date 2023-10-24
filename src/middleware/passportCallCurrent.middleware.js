import passport from 'passport';
import logger from '../services/logger.js';

export const passportCallCurrent = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(
      strategy,
      { session: false },
      function (err, user, info) {
        if (err) { return next(err); }
        console.log(strategy);
        if (strategy === 'register') {
          req.user = null;
          return next();
        }
        if (!user) {
          const message = info.message ? info.message : 'NO ESTA LOGUEADO';
          logger.error(message);
          req.user = null;
        } else {
          req.user = user;
        }
        // logger.info(req.user);
        next();
      })(req, res, next);
  };
};
