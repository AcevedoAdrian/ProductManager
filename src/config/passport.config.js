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
        console.log('Campos vacios');
        done(null, false);
      }
      if (password.length < 4) {
        console.log('Password corto');
        done(null, false);
      }
      const user = await userModel.findOne({ email: username });
      if (user) {
        console.log('User ya existe');
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
      return done('Error al loguear un usuario');
    }
  }));

  passport.use('login', new LocalStrategy({

    usernameField: 'email'
  }, async (username, password, done) => {
    try {
      const user = await userModel.findOne({ email: username });
      if (!user) {
        console.log('usuario no existe');
        return done(null, false);
      }
      if (!isValidPassword(user, password)) {
        console.log('password icorrecto');
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done('Error al obtner al loguear');
    }
  }));

  passport.use('github', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log(profile._json.email);
      const user = await userModel.findOne({ email: profile._json.email });
      if (user) return done(null, user);
      const newUser = await userModel.create({
        first_name: profile._json.name,
        last_name: ' ',
        email: profile._json.email,
        age: 0,
        password: ' ',
        role: 'user'
      });
      return done(null, newUser);
    } catch (err) {
      return done(`Error to login with GitHub => ${err.message}`);
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
