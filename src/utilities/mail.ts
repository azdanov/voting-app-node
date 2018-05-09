import htmlToText from 'html-to-text';
import juice from 'juice';
import nodemailer from 'nodemailer';
import pug from 'pug';

const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(`${process.cwd()}/views/email/${filename}.pug`, options);
  return juice(html);
};

export const send = async options => {
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const html = generateHTML(options.filename, options);
  const text = htmlToText.fromString(html);

  const mailOptions = {
    text,
    html,
    from: `${process.env.MAIL_ADMIN_NAME} <${process.env.MAIL_ADMIN_NOREPLY}>`,
    to: options.user.email,
    subject: options.subject,
  };

  return await transport.sendMail(mailOptions);
};
