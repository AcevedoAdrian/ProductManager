
import dotenv from 'dotenv';
// VARIABLE DE ENTORNOS
dotenv.config({ path: '.env' });

export default {
  port: process.env.PORT || 8000,
  mongoURL: process.env.DATABASE,
  database: process.env.NAME_DATABASE,
  jwtNameCookie: process.env.JWT_NAME_COOKIE,
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
  cookiePrivateKey: process.env.COOKIE_PRIVATE_KEY,
  githubClientID: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  githubCallBackURL: process.env.GITHUB_CALLBACK_URL,
  persistence: process.env.PERSISTENCE,
  environment: process.env.ENVIRONMENT
};
