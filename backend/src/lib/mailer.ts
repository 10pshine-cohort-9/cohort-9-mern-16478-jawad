import nodemailer, { type Transporter } from "nodemailer";

import { env } from "../config/env.js";

const createMailer = (): Transporter | null => {
  if (!env.MAIL_ENABLED) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
};

export const mailer = createMailer();
