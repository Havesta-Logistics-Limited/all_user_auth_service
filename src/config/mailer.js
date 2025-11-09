import "dotenv/config";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const message = {
    from: "charleynami@gmail.com",
    to: options.receiverEmail,
    subject: options.subject,
    text: options.message,
    html: options.html || null,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (err) {
    console.log(err, "Error sending email");
    return false;
  }
};

export default sendEmail;
