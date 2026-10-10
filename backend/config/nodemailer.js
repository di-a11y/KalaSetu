import nodemailer from 'nodemailer';

/*
  Reuses your Gmail account to send OTP emails.

  Setup required in backend/.env:
    EMAIL_USER="youraddress@gmail.com"
    EMAIL_PASS="your16charapppassword"

  EMAIL_PASS must be a Gmail "App Password", NOT your normal Gmail
  password. Generate one at:
  Google Account -> Security -> 2-Step Verification (must be ON) ->
  App Passwords -> create one for "Mail".
*/

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export default transporter;
