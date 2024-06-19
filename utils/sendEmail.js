import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendEmail = async (roommates, newGasto) => {
  const emailList = roommates.map(r => r.email).join(',');

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: emailList,
    subject: 'Nuevo gasto registrado',
    text: `Un nuevo gasto ha sido registrado:\n\nRoommate: ${newGasto.roommate}\nDescripción: ${newGasto.descripcion}\nMonto: ${newGasto.monto}`
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error enviando email:', error);
  }
};
