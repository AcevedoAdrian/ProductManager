import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import { userModel } from '../dao/models/users.model.js';
import { createHash, isValidPassword } from '../utils.js';

const LocalStrategy = local.Strategy;
const initializePassport = () => {
  passport.use('register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
  }, async (req, username, password, done) => {
    const { first_name, last_name, age, email } = req.body;
    try {
      if ((!first_name, !last_name, !age, !email, !password)) {
        done(null, false);
      }
      if (password.length < 4) {
        done(null, false);
      }
      const user = await userModel.findOne({ email: username });
      if (user) {
        done(null, false);
      }
      const role = email === 'admin@coderhouse.com' && password === 'Cod3r123'
        ? 'admin'
        : 'user';

      const newUser = {
        first_name,
        last_name,
        email,
        role,
        age,
        password: createHash(password)
      };
      const result = await userModel.create(newUser);
      return done(null, result);
    } catch (error) {
      return done('error al obtner el user');
    }
  }));

  passport.use('login', new LocalStrategy({

    usernameField: 'email'
  }, async (username, password, done) => {
    try {
      const user = await userModel.findOne({ email: username });
      if (!user) {
        return done(null, false);
      }
      if (!isValidPassword(user, password)) {
        return done(null, false, { error: 'usuario o password incorrecto' });
      }
      return done(null, user);
    } catch (error) {
      return done('error al obtner el user');
    }
  }));

  passport.use('github', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await userModel.findOne({ email: profile._json.email });
      if (user) return done(null, user);
      const newUser = await userModel.create({
        first_name: profile._json.name,
        last_name: ' ',
        email: profile._json.mail,
        password: ' ',
        role: 'usuario'
      });
      return done(null, newUser);
    } catch (error) {
      return done('Error al loguear usuario');
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
