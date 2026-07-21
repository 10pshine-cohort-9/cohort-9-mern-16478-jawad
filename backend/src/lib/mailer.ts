import nodemailer, { type Transporter } from "nodemailer";

import { env } from "../config/env.js";

<<<<<<< HEAD
const SMTP_CONNECTION_TIMEOUT_MS = 10_000;
const SMTP_GREETING_TIMEOUT_MS = 10_000;
const SMTP_SOCKET_TIMEOUT_MS = 15_000;

=======
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
const createMailer = (): Transporter | null => {
  if (!env.MAIL_ENABLED) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
<<<<<<< HEAD

=======
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
<<<<<<< HEAD

    connectionTimeout: SMTP_CONNECTION_TIMEOUT_MS,
    greetingTimeout: SMTP_GREETING_TIMEOUT_MS,
    socketTimeout: SMTP_SOCKET_TIMEOUT_MS,
=======
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
  });
};

export const mailer = createMailer();
