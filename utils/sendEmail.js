const { SchemaTypeOptions } = require('mongoose');
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  let message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    // text: options.message,
    html: `<h3>${options.message}</h3>`, // html body
  };
  const info = await transporter.sendMail(message);
  console.log('Message sent: %s', message.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
};

module.exports = sendEmail;
