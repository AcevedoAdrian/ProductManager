import nodemailer from 'nodemailer';
import config from '../config/config.js';

export const sendMail = async (hostname, port, email, token) => {
  // CONFIGURACION DEL MAILER
  const mailerConfig = {
    service: 'gmail',
    auth: {
      user: config.nodemailer.user,
      pass: config.nodemailer.password
    }
  };

  const transporter = nodemailer.createTransport(mailerConfig);
  // PREPARACION DEL MENSAJE A ENVIAR
  const message = {
    from: config.nodemailer.user,
    to: email,
    subject: '[Coder e-comm API] Reset your password',
    html: `
      <h1>[Coder e-comm API] Reset your password</h1>
      <hr />
      You have asked to reset your password. You can do it here: 
      <a href="http://${hostname}:${config.port}/reset-password/${token}">
        http://${hostname}:${config.port}/reset-password/${token}
      </a>
      <hr />
      Best regards,<br><strong>The Coder e-commece API team</strong>`
  };
  // ENVIO DEL MENSAJE
  try {
    const sendMessage = await transporter.sendMail(message);
    return sendMessage;
  } catch (error) {
    throw new Error(`Error al enviar el correo. ${error.message}`);
  }
};

export const sendMailDeleteProduct = async (email, product) => {
  // CONFIGURACION DEL MAILER
  const mailerConfig = {
    service: 'gmail',
    auth: {
      user: config.nodemailer.user,
      pass: config.nodemailer.password
    }
  };

  const transporter = nodemailer.createTransport(mailerConfig);
  // PREPARACION DEL MENSAJE A ENVIAR
  const message = {
    from: config.nodemailer.user,
    to: email.email,
    subject: '[Coder e-comm API] Producto Eliminado',
    html: `<h1>[Coder e-comm API] Producto eliminados por admin</h1>
      <hr />
      <p>Algunos productos son eliminados por el admin</p>
      <hr />
      Best regards,<br><strong>The Coder e-commerce API team</strong>`
  };
  // ENVIO DEL MENSAJE
  try {
    const sendMessage = await transporter.sendMail(message);
    return sendMessage;
  } catch (error) {
    throw new Error(`Error al enviar el correo. ${error.message}`);
  }
};

export const sendMailDeleteUser = async (email) => {
  // CONFIGURACION DEL MAILER
  const mailerConfig = {
    service: 'gmail',
    auth: {
      user: config.nodemailer.user,
      pass: config.nodemailer.password
    }
  };

  const transporter = nodemailer.createTransport(mailerConfig);
  // PREPARACION DEL MENSAJE A ENVIAR
  const message = {
    from: config.nodemailer.user,
    to: email.email,
    subject: '[Coder e-comm API] Eliminacion de cuenta',
    html: `<h1>[Coder e-comm API]Usuario eliminado por inactividad </h1>
     
      Best regards,<br><strong>The Coder e-commerce API team</strong>`
  };
  // ENVIO DEL MENSAJE
  try {
    const sendMessage = await transporter.sendMail(message);
    return sendMessage;
  } catch (error) {
    throw new Error(`Error al enviar el correo. ${error.message}`);
  }
};
