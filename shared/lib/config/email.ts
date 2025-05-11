import nodemailer from 'nodemailer';
import { render } from "@react-email/render";
import {
  ChangeEmailVerificationTemplate,
  ResetPasswordEmailTemplate,
  VerificationEmailTemplate,

} from '@/features/auth/components/organisms/email-templates';
import InvoiceStripeTemplate from '@/features/auth/components/organisms/email-templates/invoice-stripe';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendVerificationEmail = async ({ email, verificationUrl, }: {
  email: string;
  verificationUrl: string;
}) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your Email address",
    html: await render(
      VerificationEmailTemplate({ inviteLink: verificationUrl })
    ),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendResetPasswordEmail = async ({
                                               email,
                                               verificationUrl,
                                             }: {
  email: string;
  verificationUrl: string;
}) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset Password Link",
    html: await render(
      ResetPasswordEmailTemplate({ inviteLink: verificationUrl })
    ),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendChangeEmailVerification = async ({ email, verificationUrl }: {
  email: string;
  verificationUrl: string;
}) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Change Email Verification",
    html: await render(
      ChangeEmailVerificationTemplate({ inviteLink: verificationUrl })
    ),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};


