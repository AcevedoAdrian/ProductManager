import multer from 'multer';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/public/img');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

export const uploader = multer({ storage });
