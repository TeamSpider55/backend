const nodemailer = require("nodemailer");
require("dotenv").config();

const user = process.env.EMAIL;
const pw = process.env.EMAIL_PW;

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: user,
    pass: pw,
  },
});

const sendConfirmationEmail = (name, email, confirmationCode) => {
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "Confirm your OneThread account registration",
      html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for registering. Please verify your account by clicking on the following link</p>
        <a href=http://localhost:8081/confirm/${confirmationCode}> Click here</a>
        </div>`,
    })
    .catch((err) => console.log(err));
};

const sendPasswordResetEmail = (name, email, link) => {
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "Confirm your OneThread account registration",
      html: `<h1>Password Reset</h1>
        <h2>G'day ${name}</h2>
        <p>Please follow the link below to reset your password</p>
        <a href=http://localhost:8081/password-reset/${link}> Reset Password</a>
        </div>`,
    })
    .catch((err) => console.log(err));
};

const sendInvitationLink = (start, invitationLink) => {
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "Confirm your involvement in event!!!",
      html: `<h1>Confirming position</h1>
        <h2>G'day</h2>
        <p>Please follow the link below to confirm position @event:${new Date(start)}</p>
        <a href=http://localhost:8081/event/confirm/${invitationLink}> Accept</a>
        </div>`,
    })
    .catch((err) => console.log(err));
}
module.exports = {
  sendConfirmationEmail,
  sendPasswordResetEmail,
  sendInvitationLink
};
