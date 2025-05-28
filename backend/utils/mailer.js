require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Add Gmail address
    pass: process.env.EMAIL_PASSWORD, // Add Gmail App Password
  },
});

async function sendRegistrationEmail(to, name) {
  const mailOptions = {
    from: `"Global Study Share" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to Global Study Share",
    html: `
      <h3>Hi ${name},</h3>
      <p>Thank you for registering on our platform!</p>
      <p>We're excited to have you with us.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendRegistrationEmail };
//levin@admin.com
// admin123
