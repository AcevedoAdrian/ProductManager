import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt';
import GitHubStrategy from 'passport-github2';
import config from './config.js';

import { userModel } from '../models/users.model.js';
import cartModel from '../models/carts.model.js';
import { cookieExtractor, generateToken } from '../utils.js';
import logger from '../services/logger.js';

// core de la estrategia de local
const LocalStrategy = local.Strategy;
// core de la estrategia de jwt
const JWTStrategy = jwt.Strategy;
// Extrator de jwt ya sea de header o cookies
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
  // REGISTER
  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email'
      },
      async (req, username, password, done) => {
        try {
          // logger.info('REGISTER');
          const { first_name, last_name, age, email } = req.body;
          if ((!first_name, !last_name, !age, !email, !password)) {
            logger.error('Campos vacios');
            return done(null, false, { message: 'No se aceptan campos vacios' });
          }
          if (password.length < 4) {
            logger.error('Password corto');
            return done(null, false, { message: 'Password muy corto' });
          }

          const user = await userModel.findOne({ email: username });
          if (user) {
            logger.error('User already exits');
            return done(null, false, { message: 'Usuario ya existe' });
          }
          const cartForNewUser = await cartModel.create({});
          let role;
          email === config.adminEmail && password === config.adminPassword
            ? (role = 'admin')
            : (role = 'user');

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password,
            cart: cartForNewUser._id,
            role
          };
          const userCreater = await userModel.create(newUser);
          // logger.error(`log ${userCreater}`);
          return done(null, userCreater);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  // LOGIN
  passport.use(
    'login', new LocalStrategy({
      usernameField: 'email'
    }, async (username, password, done) => {
      try {
        const user = await userModel.findOne({ email: username });

        if (!user) {
          logger.error('usuario no existe');
          return done(null, false, { message: 'Usuario o Password incorrecto ' });
        }
        const validete = await user.isValidPassword(password);
        if (!validete) {
          logger.error('password icorrecto');
          return done(null, false, { message: 'Usuario o Password incorrecto ' });
        }
        const token = generateToken(user);
        user.token = token;
        return done(null, user, { message: 'LOGIN CORRECTO' });
      } catch (error) {
        return done(error);
      }
    }));
  // JWT
  passport.use(
    'jwt',
    new JWTStrategy(
      {
        /*
        INDICO LA FORMA DE EXTRAER LA COOKIE,
        EN ESTE CASO LO HACE CON EL METO QUE CONFIGURAMOS EN COOKIEEXTRATOR
        EL CUAL RETORNA UN TOKEN
        */
        // jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        // ACA VA EL SECRET QUE USAMOS PARA GENERAR EL TOKEN EN GENERATE TOKEN
        secretOrKey: config.jwtPrivateKey
      },
      async (jwt_payload, done) => {
        logger.info('JWTStrategy');
        try {
          return done(null, jwt_payload);
        } catch (error) {
          done(error);
        }
      }
    )
  );
  // GITHUB
  passport.use('github', new GitHubStrategy({
    clientID: config.githubClientID,
    clientSecret: config.githubClientSecret,
    callbackURL: config.githubCallBackURL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      logger.error(profile._json.email);

      let user = await userModel.findOne({ email: profile._json.email });
      logger.error(user);
      if (user) {
        // return done(null, user, { message: 'El usuario ya existe' });
        // Si el usuario ya existe en la base de datos, generamos el token
        const token = generateToken(user);
        user.token = token;
        // Enviamos el token como una cookie en la respuesta
        return done(null, user);
      }
      // Para crear un carrtio nuevo
      // const cartNewUser = await cartModel.create({});
      user = await userModel.create({
        first_name: profile._json.name || profile.username,
        last_name: ' ',
        email: profile._json.email,
        age: 0,
        password: ' '
      });
      const token = generateToken(user);
      user.token = token;

      return done(null, user, { message: 'Se creo el uruario correctamente' });
    } catch (err) {
      return done(`Error to login with GitHub => ${err.message}`);
    }
  }));
  // Current
  passport.use(
    'current',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.jwtPrivateKey
      },
      async (jwt_payload, done) => {
        try {
          const user = jwt_payload;
          if (!user) {
            return done(null, false, { message: 'No se proporcionó token' });
          }
          const existingUser = await userModel.findById(user._id).lean().exec();
          if (!existingUser) {
            return done(null, false, { message: 'No hay ningún usuario con sesión activa' });
          }
          return done(null, existingUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
