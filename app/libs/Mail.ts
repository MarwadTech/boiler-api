import logger from "../../logs/config/logger";
import { createTransport } from "nodemailer";
import { config } from "dotenv";

config();

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_SMTP_USER,
    pass: process.env.MAIL_SMTP_PASS,
  },
});

export const otpForEmailVerification = async (options: { email: string; name?: string; otp: string }) => {
  const messageId = Date.now();

  const mail: any = {
    from: {
      name: process.env.APP_NAME as string,
      address: process.env.MAIL_SMTP_USER as string,
    },
    to: options.email,
    subject: "OTP for Email Verification",
    html: `
    <p style="font-size:15px;">Your One Time Password (OTP) for email verification is</p>
    <p><span style="font-size:30px;"><strong>${options.otp}</strong></span></p>
    <p style="font-size:15px;">This OTP is valid for 10 minutes. On expiry, kindly regenerate the OTP.</p>
    <p style="font-size:15px;">Regards</p>
    <p style="font-size:15px;">Team <strong>${process.env.APP_NAME}</strong></p>
    `,
    headers: {
      "Message-ID": messageId,
      "In-Reply-To": messageId,
    },
  };

  try {
    await transporter.sendMail(mail);
    logger.info(`Email Verification OTP sent to ${options.email}`);
  } catch (error) {
    console.log("Email service failed silently.");
    logger.error("Error: ", error);
  }
};
