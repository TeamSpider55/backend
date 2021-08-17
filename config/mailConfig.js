const nodemailer = require("nodemailer");
require("dotenv").config();

const email = process.env.EMAIL;
const pw = process.env.EMAIL_PW;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    email: email,
    pass: pw,
  },
});

const sendConfirmationEmail = (name, destEmail, confirmationCode) => {
  console.log("Check");
  transport
    .sendMail({
      from: email,
      to: destEmail,
      subject: "Confirm your OneThread account registration",
      html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for registering. Please verify your account by clicking on the following link</p>
        <a href=http://localhost:8081/confirm/${confirmationCode}> Click here</a>
        </div>`,
    })
    .catch((err) => console.log(err));
};

module.exports = {
  sendConfirmationEmail,
};
