import nodemailer, { Transporter } from "nodemailer";
import path from "path";
import ejs from "ejs";
import dotenv from "dotenv";

dotenv.config();

interface Email {
  email: string;
  subject: string;
  templete: string;
  data: { [key: string]: any };
}

const sendMail = async (emailData: Email): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "567"),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const { email, subject, templete, data } = emailData;

  //? Get email templete file
  const templetePath = path.join(__dirname, "../mails", templete);

  //?Render email templete with ejs
  const html = await ejs.renderFile(templetePath, data);

  const mail = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mail);
};

export default sendMail;
