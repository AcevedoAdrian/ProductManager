import passport from 'passport';
import logger from '../services/logger.js';

export const passportCallCurrent = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(
      strategy,
      { session: false },
      function (err, user, info) {
        // console.log(info);
        if (err) { return next(err); }

        if (!user) {
          // return res.status(401).send(
          //   {
          //     status: 'error',
          //     message: info.message ? info.message : 'NO ESTA LOGUEADO'
          //   });
          const message = info.message ? info.message : 'NO ESTA LOGUEADO';
          logger.info(message);
          req.user = null;
        } else {
          req.user = user;
        }
        logger.info(req.user);
        next();
      })(req, res, next);
  };
};
