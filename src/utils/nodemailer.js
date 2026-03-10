import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export const sendResetCodeEmail = async (email, resetCode) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Código de restablecimiento de contraseña',
    html: `
      <h2>Restablecimiento de contraseña</h2>
      <p>Tu código de verificación es:</p>
      <h1 style="letter-spacing: 8px; font-size: 36px; text-align: center;">${resetCode}</h1>
      <p>Este código expirará en 15 minutos.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};
