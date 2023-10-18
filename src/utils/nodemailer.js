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
      Best regards,<br><strong>The Coder e-comm API team</strong>`
  };
  // ENVIO DEL MENSAJE
  try {
    console.log(message);
    const sendMessage = await transporter.sendMail(message);
    return sendMessage;
  } catch (error) {
    throw new Error(`Error al enviar el correo. ${error.message}`);
  }
};
