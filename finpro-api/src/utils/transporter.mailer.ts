import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.TRANSPORTER_MAILER_USER, // Email Sender
    pass: process.env.TRANSPORTER_MAILER_APP_PASS, // Key Generate
  },
  tls: {
    rejectUnauthorized: false,
  },
});
