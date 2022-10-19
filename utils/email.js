const nodemailer = require('nodemailer');

module.exports = async (options) => {
  // 1. Create a transporter
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  // 2. Define email options
  const mailOptions = {
    from: 'Ruarai Kirk <no_reply@natours.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  // 3. Send email
  await transport.sendMail(mailOptions);
};
