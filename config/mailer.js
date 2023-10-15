const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const uuid = require("uuid");

dotenv.config();

const secretKey = process.env.MAILER_KEY;

const mainTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "example.juliusz@gmail.com",
    pass: secretKey,
  },
  secure: true,
});

const generateVerificationToken = () => uuid.v4();

const sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `http://localhost:3000/api/users/verify/${verificationToken}`;

  const mailOptions = {
    from: "example.juliusz@gmail.com",
    to: email,
    subject: "registration confirmation",
    text: `Click the following link to confirm your registration:${verificationLink}`,
  };
  try {
    const info = await mainTransporter.sendMail(mailOptions);
    console.log("The verification email has been sent:", info.response);
  } catch (error) {
    console.log("Error while sending verification email:", error);
  }
};

module.exports = {
  generateVerificationToken,
  sendVerificationEmail,
};
