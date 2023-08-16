import multer from 'multer';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from './config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPssword = (user, password) => bcrypt.compareSync(password, user.password);

// MULTER
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/public/img`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now());
  }
});
export const uploader = multer({ storage });

// GENRA EL TOKEN CON JWT
export const generateToken = user => {
  const { _id, last_name, first_name, email, role } = user;
  const SECRET = config.jwtPrivateKey;
  // jwt.sing('objeto informacion', 'clave para hacer cifrado', 'tiempo de vida')
  // const token = jwt.sign({ user }, SECRET, { expiresIn: '24h' }); funcionando
  const token = jwt.sign({ _id, last_name, first_name, email, role }, SECRET, { expiresIn: '24h' });
  return token;
};
// ECTRAE EL TOKEN DE UNA COOKIE
export const cookieExtractor = req => {
  const COOKIENAME = config.jwtNameCookie;
  const token =
    req && req.signedCookies[COOKIENAME] ? req.signedCookies[COOKIENAME] : null;
  return token;
};

export default __dirname;
