
import dotenv from 'dotenv';
// VARIABLE DE ENTORNOS
dotenv.config({ path: '.env' });

export default {
  port: process.env.PORT || 8080,
  mongoURL: process.env.DATABASE,
  database: process.env.NAME_DATABASE,
  jwtNameCookie: process.env.JWT_NAME_COOKIE,
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
  cookiePrivateKey: process.env.COOKIE_PRIVATE_KEY,
  githubClientID: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  githubCallBackURL: process.env.GITHUB_CALLBACK_URL,
  persistence: process.env.PERSISTENCE,
  environment: process.env.ENVIRONMENT,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  nodemailer: {
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD
  }
};
